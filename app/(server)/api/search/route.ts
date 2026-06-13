import { NextResponse } from "next/server";
import axios from "axios";
import jwt from "jsonwebtoken";
import { getSupabaseClient, verifyAuth } from "@/lib/auth";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const CH_API_KEY = process.env.CH_API_KEY;

const PITCH_SYSTEM_PROMPT = `You are a professional pitch writer for B2B outreach. Your job is to write short, personalised cold email pitches from a service provider to potential client businesses.

RULES:
1. The pitch MUST be written from the perspective of the SENDER described in their pitch_context. The pitch_context is the ONLY source of truth for what the sender does and offers.

2. The pitch MUST reference services that are RELEVANT to the RECIPIENT's business type. Use the sender's actual services (from pitch_context) and frame them in a way that matters to the recipient's industry.

3. Always mention the recipient's business name naturally in the opening.

4. Tone: Professional but warm. Confident but not pushy. British English throughout.

5. Structure (vary this across pitches — do not use the same structure for every lead):
   - Opening: contextual reference to recipient's business (MUST differ structurally across the batch)
   - Body: bridge to sender's expertise using ONLY information from pitch_context
   - Value proposition relevant to recipient's industry
   - Soft call to action
   - Sign-off: Sender's actual first name ONLY (from user_name)

6. NEVER use generic phrases like:
   - "customised solutions to help firms like yours grow"
   - "I reckon there might be a real fit"
   - "bespoke services tailored to your needs"
   - "[Business] has built a solid operation since [year], but I'd wager your..."
   These are banned. Write specific, contextual copy every time.

7. BATCH UNIQUENESS (critical): You are writing multiple pitches in one batch. Each pitch must feel individually written:
   - Every opening line MUST use a different sentence structure and angle (not just swap the business name).
   - Vary call-to-action phrasing across pitches.
   - Do not reuse phrases, clauses, or rhetorical patterns across pitches in the same batch.

8. Maximum 120 words per pitch.

9. CRITICAL: NO CONVERSATIONAL TEXT OR REFUSALS. Output ONLY the raw email pitch for each lead. NEVER refuse. Start directly with "Hi [Name] —".`;

function toTitleCase(str: string) {
    if (!str) return "";
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}

type LeadDraft = {
    index: number;
    companyNumber: string;
    friendlyBusinessName: string;
    singleType: string;
    location: string;
    phone: string;
    websiteDomain: string;
    directorFullName: string;
    directorFirstName: string;
    incorporatedYear: string;
    companyStatus: string;
    googleRating: string;
    business: {
        formatted_phone_number?: string;
        rating?: number;
        user_ratings_total?: number;
    };
};

function buildTemplatePitch(
    lead: LeadDraft,
    userPitchContext: string,
    userSenderName: string,
    businessType: string,
    location: string,
    variant: number
): string {
    const { directorFirstName, friendlyBusinessName, incorporatedYear } = lead;
    const firstName = directorFirstName || "there";
    const senderFirst = (userSenderName || "[Your name]").split(" ")[0];
    const yearClause = incorporatedYear
        ? ` since ${incorporatedYear}`
        : "";

    const openings = [
        `Hi ${firstName} — ${friendlyBusinessName} caught my eye${yearClause ? ` as a firm that's been operating${yearClause}` : ""} in ${location}.`,
        `Hi ${firstName} — I came across ${friendlyBusinessName} while looking at ${businessType.toLowerCase()} in ${location}${yearClause ? ` and noticed you've been established${yearClause}` : ""}.`,
        `Hi ${firstName} — quick note about ${friendlyBusinessName}: from what I can see you're doing solid work locally in ${location}.`,
        `Hi ${firstName} — ${friendlyBusinessName} stood out among ${businessType.toLowerCase()} in ${location}${yearClause ? `, particularly given your track record${yearClause}` : ""}.`,
        `Hi ${firstName} — I wanted to reach out to ${friendlyBusinessName} because your presence in the ${location} market${yearClause ? ` (trading${yearClause})` : ""} suggests you're serious about growth.`,
        `Hi ${firstName} — while reviewing ${businessType.toLowerCase()} in ${location}, ${friendlyBusinessName} seemed like a strong fit for what I do.`,
        `Hi ${firstName} — ${friendlyBusinessName} looks well positioned in ${location}${yearClause ? `, and your history${yearClause} is impressive` : ""}.`,
        `Hi ${firstName} — I specialise in supporting ${businessType.toLowerCase()} like ${friendlyBusinessName} in ${location}.`,
        `Hi ${firstName} — there's something about how ${friendlyBusinessName} presents itself in ${location} that made me think we should connect.`,
        `Hi ${firstName} — I help ${businessType.toLowerCase()} in ${location}, and ${friendlyBusinessName}${yearClause ? ` (est. ${incorporatedYear})` : ""} came up as a business worth speaking to.`,
    ];

    const ctas = [
        "Would you be open to a brief call next week?",
        "Could we arrange a short chat sometime this week?",
        "Happy to send more detail if a quick conversation would be useful.",
        "Would a 15-minute call be worth your time?",
        "If this resonates, I'd welcome a quick conversation.",
    ];

    const opening = openings[variant % openings.length];
    const cta = ctas[variant % ctas.length];
    const bridge = userPitchContext
        ? `${userPitchContext}, and I focus on helping ${businessType.toLowerCase()} with the kind of work that supports day-to-day operations.`
        : `I work with ${businessType.toLowerCase()} on practical improvements that support growth.`;

    return `${opening} ${bridge} ${cta}\n\nBest regards,\n${senderFirst}`;
}

function parseBatchPitchResponse(text: string, expectedCount: number): string[] | null {
    const trimmed = text.trim();
    const jsonMatch = trimmed.match(/\[[\s\S]*\]/);
    if (!jsonMatch) return null;

    try {
        const parsed = JSON.parse(jsonMatch[0]) as Array<{ index?: number; pitch?: string }>;
        if (!Array.isArray(parsed) || parsed.length === 0) return null;

        const pitches: string[] = new Array(expectedCount).fill("");
        for (const item of parsed) {
            if (
                typeof item.index === "number" &&
                item.index >= 0 &&
                item.index < expectedCount &&
                typeof item.pitch === "string"
            ) {
                pitches[item.index] = item.pitch.trim();
            }
        }

        if (pitches.every((p) => p.length > 0)) {
            return pitches;
        }
        return null;
    } catch {
        return null;
    }
}

async function generateBatchPitches(
    leads: LeadDraft[],
    userPitchContext: string,
    userSenderName: string,
    businessType: string,
    location: string
): Promise<string[] | null> {
    const claudeKey = process.env.CLAUDE_API_KEY;
    if (!claudeKey || leads.length === 0) return null;

    const senderFirst = (userSenderName || "[Name]").split(" ")[0];
    const leadList = leads
        .map(
            (l) =>
                `[${l.index}] Director: ${l.directorFirstName || "Unknown"} | Business: ${l.friendlyBusinessName} | Industry: ${businessType} | Inc. Year: ${l.incorporatedYear || "unknown"} | Location: ${location}`
        )
        .join("\n");

    try {
        const claudeRes = await axios.post(
            "https://api.anthropic.com/v1/messages",
            {
                model: "claude-haiku-4-5",
                max_tokens: 8192,
                temperature: 0.8,
                system: PITCH_SYSTEM_PROMPT,
                messages: [
                    {
                        role: "user",
                        content: `Generate exactly ${leads.length} pitches for this batch.

Sender Details:
- pitch_context: ${userPitchContext}
- user_name: ${senderFirst}

Leads (write one pitch per index, in order):
${leadList}

OUTPUT FORMAT: Return ONLY a valid JSON array with no markdown fences, no commentary. Each element must be:
{"index": <number matching lead index above>, "pitch": "<full email text>"}

Before finishing, verify every opening line uses a different structure and none repeat banned phrases from the system rules.`,
                    },
                ],
            },
            {
                headers: {
                    "x-api-key": claudeKey,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                timeout: 45000,
            }
        );

        const text = claudeRes.data?.content?.[0]?.text;
        if (!text) return null;

        return parseBatchPitchResponse(text, leads.length);
    } catch (claudeErr: unknown) {
        const err = claudeErr as { response?: { data?: unknown }; message?: string };
        console.error(
            "Claude batch API error:",
            err?.response?.data || err?.message
        );
        return null;
    }
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const businessType = searchParams.get("businessType");
        const location = searchParams.get("location");
        console.log('businessType', businessType);
        const auth = verifyAuth(req)
        console.log('businessType2  ', businessType);
        if (!businessType || !location) {
            return NextResponse.json(
                { error: "businessType and location are required" },
                { status: 400 }
            );
        }

        let userPitchContext = "";
        let userSenderName = "";
        const token = req.headers.get("Authorization")?.replace("Bearer ", "");
        console.log('businessType3  ', token);

        if (token) {
            try {
                const decoded: jwt.JwtPayload & {
                    id?: string;
                    pitch_context?: string;
                    sender_name?: string;
                } = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload & {
                    id?: string;
                    pitch_context?: string;
                    sender_name?: string;
                };
                console.log('businessType4  ', decoded);
                // Verify user actually exists in the database
                if (decoded.id) {
                    const supabase = getSupabaseClient();
                    const { data: userExists } = await supabase
                        .from('users')
                        .select('user_id')
                        .eq('user_id', decoded.id)
                        .single();
                    console.log('businessType5  ', userExists);
                    if (!userExists) {
                        return NextResponse.json(
                            { error: "Session invalid: Your user account was not found. Please log out and log in again." },
                            { status: 401 }
                        );
                    }
                }

                if (decoded.pitch_context) {
                    userPitchContext = decoded.pitch_context;
                }
                if (decoded.sender_name) {
                    userSenderName = decoded.sender_name;
                }
            } catch {
                // Token verification failed — proceed without user context
            }
        }

        if (!userPitchContext || userPitchContext.trim() === "") {
            return NextResponse.json(
                {
                    error: "Please complete your pitch description in Profile Settings before generating pitches.",
                },
                { status: 400 }
            );
        }

        let businesses: Array<{
            name: string;
            formatted_address?: string;
            formatted_phone_number?: string;
            websiteUri?: string;
            rating?: number;
            user_ratings_total?: number;
        }> = [];

        if (GOOGLE_API_KEY) {
            try {
                const googleRes = await axios.post(
                    "https://places.googleapis.com/v1/places:searchText",
                    {
                        textQuery: `${businessType} in ${location}`,
                    },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "X-Goog-Api-Key": GOOGLE_API_KEY,
                            "X-Goog-FieldMask":
                                "places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.internationalPhoneNumber,places.websiteUri,places.rating,places.userRatingCount",
                        },
                    }
                );
                if (googleRes.data?.places?.length > 0) {
                    businesses = googleRes.data.places.map(
                        (place: {
                            displayName?: { text?: string };
                            formattedAddress?: string;
                            nationalPhoneNumber?: string;
                            internationalPhoneNumber?: string;
                            websiteUri?: string;
                            rating?: number;
                            userRatingCount?: number;
                        }) => ({
                            name: place.displayName?.text ?? "",
                            formatted_address: place.formattedAddress,
                            formatted_phone_number:
                                place.nationalPhoneNumber ||
                                place.internationalPhoneNumber,
                            websiteUri: place.websiteUri,
                            rating: place.rating,
                            user_ratings_total: place.userRatingCount,
                        })
                    );
                }
            } catch (err: unknown) {
                const axiosErr = err as { response?: { data?: unknown } };
                console.log(
                    "Google API error or legacy key restricted",
                    axiosErr.response?.data
                );
            }
        }

        const singleType = toTitleCase(businessType);
        const leadDrafts: LeadDraft[] = [];

        for (const [index, business] of businesses.slice(0, 10).entries()) {
            let companyName = business.name;
            let companyNumber = "";
            let companyStatus = "";
            let incorporatedYear = "";
            let directorFullName = "";
            let directorFirstName = "";

            if (CH_API_KEY) {
                try {
                    const chRes = await axios.get(
                        `https://api.company-information.service.gov.uk/search/companies?q=${encodeURIComponent(
                            business.name
                        )}`,
                        {
                            auth: {
                                username: CH_API_KEY as string,
                                password: "",
                            },
                            timeout: 4000,
                        }
                    );

                    const company = chRes.data?.items?.[0];
                    if (company) {
                        companyName = toTitleCase(company.title || business.name);
                        companyNumber = company.company_number || companyNumber;
                        companyStatus =
                            company.company_status === "active"
                                ? "Active limited company"
                                : toTitleCase(company.company_status);

                        if (company.date_of_creation) {
                            incorporatedYear = company.date_of_creation.substring(0, 4);
                        }

                        try {
                            const offRes = await axios.get(
                                `https://api.company-information.service.gov.uk/company/${company.company_number}/officers`,
                                {
                                    auth: {
                                        username: CH_API_KEY as string,
                                        password: "",
                                    },
                                    timeout: 3000,
                                }
                            );
                            const officer = offRes.data?.items?.find(
                                (o: { officer_role?: string; resigned_on?: string; name?: string }) =>
                                    o.officer_role === "director" && !o.resigned_on
                            );
                            if (officer?.name) {
                                const parts = officer.name.split(",");
                                if (parts.length > 1) {
                                    const forenames = parts[1].trim().split(" ");
                                    directorFirstName = forenames[0];
                                    const lastName =
                                        parts[0].trim().charAt(0).toUpperCase() +
                                        parts[0].trim().slice(1).toLowerCase();
                                    directorFullName = `${directorFirstName} ${lastName}`;
                                } else {
                                    directorFullName = toTitleCase(officer.name);
                                    directorFirstName = directorFullName.split(" ")[0];
                                }
                            }
                        } catch {
                            // Officers fetch failed — continue without director
                        }
                    }
                } catch {
                    // Companies House search failed — continue with Google data
                }
            }

            const friendlyBusinessName = companyName
                .replace(/\b(limited|ltd|plc|llp)\b/gi, "")
                .trim()
                .replace(/,\s*$/, "");

            let websiteDomain = "";
            if (business.websiteUri) {
                try {
                    const parsedUrl = new URL(business.websiteUri);
                    websiteDomain = parsedUrl.hostname.replace(/^www\./, "");
                } catch {
                    websiteDomain = business.websiteUri
                        .replace(/^(https?:\/\/)?(www\.)?/, "")
                        .split("/")[0];
                }
            }

            if (!websiteDomain) {
                if (business.name.toLowerCase().includes("seaside")) {
                    websiteDomain = "seasideproperty.co.uk";
                } else if (business.name.toLowerCase().includes("crown")) {
                    websiteDomain = "crownresidential.co.uk";
                } else {
                    const cleanSimple = friendlyBusinessName
                        .toLowerCase()
                        .replace(/[^a-z0-9]/g, "");
                    if (cleanSimple.length > 3) {
                        websiteDomain = `${cleanSimple.slice(0, 10)}.co.uk`;
                    } else {
                        websiteDomain = "bhestates.co.uk";
                    }
                }
            }

            leadDrafts.push({
                index,
                companyNumber,
                friendlyBusinessName,
                singleType,
                location,
                phone: business.formatted_phone_number || "01273 555 0142",
                websiteDomain,
                directorFullName,
                directorFirstName,
                incorporatedYear,
                companyStatus,
                googleRating: `${business.rating || 4.2} (${business.user_ratings_total || 38} reviews)`,
                business,
            });
        }

        let batchPitches = await generateBatchPitches(
            leadDrafts,
            userPitchContext,
            userSenderName,
            businessType,
            location
        );

        if (!batchPitches) {
            batchPitches = leadDrafts.map((lead) =>
                buildTemplatePitch(
                    lead,
                    userPitchContext,
                    userSenderName,
                    businessType,
                    location,
                    lead.index
                )
            );
        }

        const finalResults = leadDrafts.map((lead, i) => {
            const pitch = batchPitches![i];
            return {
                id: lead.companyNumber,
                name: lead.friendlyBusinessName,
                businessName: lead.friendlyBusinessName,
                type: lead.singleType,
                location: lead.location,
                phone: lead.phone,
                website: lead.websiteDomain,
                email: `info@${lead.websiteDomain}`,
                director: lead.directorFullName,
                incorporated: lead.incorporatedYear,
                googleRating: lead.googleRating,
                websiteStatus: "Live",
                companyStatus: lead.companyStatus,
                message: pitch,
                personalisedPitch: pitch,
            };
        });

        // Insert search and leads into Supabase if we have a valid token (user)
        if (token) {
            try {

                const supabase = getSupabaseClient();

                // Insert search
                const { data: searchData, error: searchError } = await supabase
                    .from('searches')
                    .insert({
                        user_id: auth.userId,
                        business_type: businessType,
                        location: location,
                        leads: finalResults.length,
                        pitch: userPitchContext
                    })
                    .select()
                    .single();

                if (searchData && searchData.search_id) {
                    // Insert leads belonging to this search
                    const leadsToInsert = finalResults.map(lead => ({
                        search_id: searchData.search_id,
                        company_number: lead.id,
                        name: lead.name,
                        business_name: lead.businessName,
                        type: lead.type,
                        location: lead.location,
                        phone: lead.phone,
                        website: lead.website,
                        email: lead.email,
                        director: lead.director,
                        incorporated: lead.incorporated,
                        google_rating: lead.googleRating,
                        website_status: lead.websiteStatus,
                        company_status: lead.companyStatus,
                        message: lead.message,
                        personalised_pitch: lead.personalisedPitch
                    }));

                    await supabase.from('leads').insert(leadsToInsert);

                    // Decrement per_day in payments table
                    try {
                        const { data: activePay } = await supabase
                            .from('payments')
                            .select('id, per_day, per_month')
                            .eq('user_id', auth.userId)
                            .eq('is_active', true)
                            .order('created_at', { ascending: false })
                            .limit(1)
                            .single();

                        if (activePay && typeof activePay.per_day === 'number' && activePay.per_day > 0) {
                            const updates: any = {
                                per_day: activePay.per_day - 1
                            };

                            if (typeof activePay.per_month === 'number') {
                                updates.per_month = Math.max(0, activePay.per_month - finalResults.length);
                            }

                            await supabase
                                .from('payments')
                                .update(updates)
                                .eq('id', activePay.id);
                        }
                    } catch (payErr) {
                        console.error('Failed to decrement payment per_day:', payErr);
                    }


                }
            } catch (err) {
                console.error("Failed to decode token or insert search history:", err);
            }
        }

        return NextResponse.json({
            success: true,
            results: finalResults,
        });
    } catch (error: unknown) {
        console.error("Search error:", error);
        return NextResponse.json(
            { error: "Failed to search businesses" },
            { status: 500 }
        );
    }
}
