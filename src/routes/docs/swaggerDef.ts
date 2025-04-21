import { config } from '../../config';
import { version } from '../../../package.json';

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Lean Startup Backend API Documentation',
    version,
    description: 'This is the API documentation for the Lean Startup Backend.',
    license: {
      name: 'MIT',
      url: 'https://github.com/bafode/lean_startup_backend/blob/main/LICENSE',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Local server',
    },
    {
      url: `https://api.leanstartup.com/v1`,
      description: 'Production server',
    },
  ],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Register a new user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  firstname: { type: 'string' },
                  lastname: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', format: 'password' },
                  gender: { type: 'string', enum: ['MALE', 'FEMALE'] },
                  authType: { type: 'string', enum: ['EMAIL', 'GOOGLE'] },
                },
                required: ['firstname', 'lastname', 'email', 'authType'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'User registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: { type: 'integer' },
                    message: { type: 'string' },
                    user: { type: 'object' },
                    tokens: {
                      type: 'object',
                      properties: {
                        access: {
                          type: 'object',
                          properties: {
                            token: { type: 'string' },
                            expires: { type: 'string', format: 'date-time' },
                          },
                        },
                        refresh: {
                          type: 'object',
                          properties: {
                            token: { type: 'string' },
                            expires: { type: 'string', format: 'date-time' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Validation error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: { type: 'integer' },
                    message: { type: 'string' },
                    details: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          field: { type: 'string' },
                          message: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Login a user',
        tags: ['Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email' },
                  password: { type: 'string', format: 'password' },
                  authType: { type: 'string', enum: ['EMAIL', 'GOOGLE'] },
                },
                required: ['email', 'authType'],
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Login successful',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: { type: 'integer' },
                    message: { type: 'string' },
                    user: { type: 'object' },
                    tokens: {
                      type: 'object',
                      properties: {
                        access: {
                          type: 'object',
                          properties: {
                            token: { type: 'string' },
                            expires: { type: 'string', format: 'date-time' },
                          },
                        },
                        refresh: {
                          type: 'object',
                          properties: {
                            token: { type: 'string' },
                            expires: { type: 'string', format: 'date-time' },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Authentication error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    code: { type: 'integer' },
                    message: { type: 'string' },
                    details: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          field: { type: 'string' },
                          message: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/users': {
      get: {
        summary: 'Get all users',
        tags: ['Users'],
        responses: {
          200: {
            description: 'List of users',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      firstname: { type: 'string' },
                      lastname: { type: 'string' },
                      email: { type: 'string', format: 'email' },
                      role: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/posts': {
      get: {
        summary: 'Get all posts',
        tags: ['Posts'],
        responses: {
          200: {
            description: 'List of posts',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      title: { type: 'string' },
                      content: { type: 'string' },
                      author: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/favorites': {
      get: {
        summary: 'Get all favorite items',
        tags: ['Favorites'],
        responses: {
          200: {
            description: 'List of favorite items',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      userId: { type: 'string' },
                      postId: { type: 'string' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/landing-contacts': {
      post: {
        summary: 'Submit a contact form',
        tags: ['Landing Contacts'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string', format: 'email' },
                  message: { type: 'string' },
                },
                required: ['name', 'email', 'message'],
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Contact form submitted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    name: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/notifications': {
      get: {
        summary: 'Get all notifications',
        tags: ['Notifications'],
        responses: {
          200: {
            description: 'List of notifications',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      userId: { type: 'string' },
                      message: { type: 'string' },
                      createdAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export default swaggerDef;
