import { NextRequest } from "next/server";
import { getBackendUrl } from "@/lib/env";
import { successResponseWithCookie, errorResponse, handleApiError, unauthorizedResponse } from "@/lib/api-response";
import { safeValidateRequestBody, loginSchema } from "@/lib/validation";
import { AUTH, SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/config";
import logger from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const validation = await safeValidateRequestBody(loginSchema, request);

    if (!validation.success) {
      logger.validation('login', validation.errors);
      return errorResponse('Invalid email or password format', 400, validation.errors);
    }

    const { email, password } = validation.data;
    logger.auth('login_attempt', email);

    // Call backend authentication service
    const loginRes = await fetch(getBackendUrl('/backend/users/authenticate'), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (loginRes.status === 200) {
      const data = await loginRes.json();

      if (!data.token) {
        logger.error('Backend returned 200 but no token', data);
        return errorResponse(ERROR_MESSAGES.AUTHENTICATION, 500);
      }

      logger.auth('login_success', email);

      // Return success response with secure cookie
      return successResponseWithCookie(
        { message: SUCCESS_MESSAGES.LOGIN },
        AUTH.TOKEN_COOKIE_NAME,
        data.token,
        SUCCESS_MESSAGES.LOGIN,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          maxAge: AUTH.SESSION_DURATION,
        }
      );
    } else if (loginRes.status === 401 || loginRes.status === 403) {
      logger.warn('login_failed', email);
      return unauthorizedResponse('Invalid email or password');
    } else {
      logger.error('Backend authentication error', { status: loginRes.status, email });
      return errorResponse(ERROR_MESSAGES.AUTHENTICATION, 500);
    }

  } catch (error) {
    logger.error("Authentication error", error);
    return handleApiError(error);
  }
}