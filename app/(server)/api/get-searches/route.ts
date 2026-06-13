import { verifyAuth, createErrorResponse, createSuccessResponse, getSupabaseClient } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    // Verify authentication
    const auth = verifyAuth(request)
    if (!auth.success) {
      return createErrorResponse(auth.error!, auth.status!)
    }

    // Get query parameters for pagination
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '21')
    const offset = parseInt(url.searchParams.get('offset') || '0')
    
    // Enforce maximum limit of 21
    const finalLimit = Math.min(limit, 21)

    const supabase = getSupabaseClient()

    // Get searches for the user with limit
    let query = supabase
      .from('searches')
      .select('*', { count: 'exact' })
      .eq('user_id', auth.userId)
      .order('created_at', { ascending: false })
      .limit(finalLimit)
      .range(offset, offset + finalLimit - 1)

    const { data: searches, error: fetchError, count } = await query

    if (fetchError) {
      console.error('Fetch searches error:', fetchError)
      return createErrorResponse('Failed to fetch searches', 500)
    }

    // Format the response
    const formattedSearches = searches?.map(search => ({
      search_id: search.search_id,
      user_id: search.user_id,
      business_type: search.business_type,
      location: search.location,
      leads: search.leads,
      pitch: search.pitch,
      created_at: search.created_at,
      updated_at: search.updated_at
    })) || []

    return createSuccessResponse({
      searches: formattedSearches,
      total: count || 0,
      limit: finalLimit,
      offset: offset,
      hasMore: (offset + finalLimit) < (count || 0)
    }, 200)

  } catch (error: any) {
    console.error('Get searches error:', error)
    return createErrorResponse(error.message || 'Internal server error', 500)
  }
}