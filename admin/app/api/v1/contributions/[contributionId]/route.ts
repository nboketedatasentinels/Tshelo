import { runApiDetail } from '@/lib/api/read-route'
import { getApiContribution } from '@/lib/data/api'
import { authenticateApiRequest } from '@/lib/api/auth'
import { createRequestId, dataServiceErrorResponse, errorResponse, failureResponse, readValidatedJson, successResponse } from '@/lib/api/http'
import { validateUuidParameter } from '@/lib/api/query'
import { validateUpdateContributionRequest } from '@/lib/api/validation'
import { updateApiContribution } from '@/lib/data/api'

export const runtime = 'nodejs'

type RouteContext = {
  params: Promise<{ contributionId: string }>
}

export async function GET(request: Request, { params }: RouteContext) {
  return runApiDetail(
    request,
    params,
    'contributionId',
    ({ client, resourceId }) => getApiContribution(client, resourceId),
    { notFoundMessage: 'Contribution not found.' },
  )
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const requestId = createRequestId()
  const authentication = await authenticateApiRequest(request)
  if (!authentication.ok) return errorResponse(authentication.error, requestId, authentication.status)
  const id = validateUuidParameter((await params).contributionId, 'contributionId')
  if (!id.ok) return failureResponse('VALIDATION_FAILED', 'contributionId must be a valid UUID.', requestId, { retryable: false, field_errors: id.fieldErrors })
  const body = await readValidatedJson(request, requestId, validateUpdateContributionRequest)
  if (!body.ok) return body.response
  const result = await updateApiContribution(authentication.auth.supabase, authentication.auth.actor.user_id, id.value, body.value)
  if (result.error) return dataServiceErrorResponse(result.error, requestId)
  if (!result.data) return failureResponse('NOT_FOUND', 'Contribution not found.', requestId)
  return successResponse(result.data, requestId)
}
