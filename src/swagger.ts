// Swagger configuration for the Node.js project
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TMI Backend API',
      version: '1.0.0',
      description: 'API documentation for TMI Backend',
    },
    servers: [
      {
        url: 'http://localhost:3001',
      },
    ],
  },
  apis: ['./src/api/*.ts'], // Adjust paths as needed
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerUi, swaggerSpec };
