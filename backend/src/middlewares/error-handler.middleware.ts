import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';

export function errorHandler(error: Error, c: Context) {
  if (error instanceof HTTPException) {
    return c.json(
      {
        success: false,
        error: {
          name: error.message,
        },
      },
      error.status
    );
  }


  return c.json(
    {
      success: false,
      error: {
        name: 'INTERNAL_SERVER_ERROR',
      },
    },
    500
  );
}
