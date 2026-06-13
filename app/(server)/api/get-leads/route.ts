import { verifyAuth, createErrorResponse, createSuccessResponse, getSupabaseClient } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const auth = verifyAuth(request)
    if (!auth.success) {
      return createErrorResponse(auth.error!, auth.status!)
    }

    const { searchParams } = new URL(request.url)
    const searchId = searchParams.get('search_id')

    if (!searchId) {
      return createErrorResponse('search_id is required', 400)
    }

    const supabase = getSupabaseClient()

    // First check if the search belongs to the user
    const { data: search, error: searchError } = await supabase
      .from('searches')
      .select('*')
      .eq('search_id', searchId)
      .eq('user_id', auth.userId)
      .single()

    if (searchError || !search) {
      return createErrorResponse('Search not found or unauthorized', 404)
    }

    // Then fetch leads
    const { data: leads, error: leadsError } = await supabase
      .from('leads')
      .select('*')
      .eq('search_id', searchId)
      .order('id', { ascending: true })

    if (leadsError) {
      return createErrorResponse('Failed to fetch leads', 500)
    }

    // Map snake_case back to camelCase expected by the frontend
    const mappedLeads = leads.map((lead: any) => ({
      id: lead.company_number,
      name: lead.name,
      businessName: lead.business_name,
      type: lead.type,
      location: lead.location,
      phone: lead.phone,
      website: lead.website,
      email: lead.email,
      director: lead.director,
      incorporated: lead.incorporated,
      googleRating: lead.google_rating,
      websiteStatus: lead.website_status,
      companyStatus: lead.company_status,
      message: lead.message,
      personalisedPitch: lead.personalised_pitch,
    }))

    return createSuccessResponse({
      search,
      leads: mappedLeads
    }, 200)

  } catch (error: any) {
    console.error('Get leads error:', error)
    return createErrorResponse(error.message || 'Internal server error', 500)
  }
}
