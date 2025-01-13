import { Application } from 'express';
import { promRegistry, trackHttpRequests } from './metrics';
import { logger } from './config';

export default function metricsLoader(app: Application) {
    // Apply the middleware to track HTTP requests and durations
    app.use(trackHttpRequests);

    // Prometheus metrics endpoint
    app.get('/v1/metrics', async (_, res) => {
        try {
            res.set('Content-Type', promRegistry.contentType);
            res.end(await promRegistry.metrics());
        } catch (error) {
            logger.error('Failed to load metrics', error);
            res.status(500).end();
        }
    });
}