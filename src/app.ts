import express, { Request as ExRequest, Response as ExResponse } from "express";
import swaggerUi from "swagger-ui-express";
import { RegisterRoutes } from "./routes";
import errorHandler from "./middlewares/errorHandler";

const app = express();
app.use(express.json());

// Swagger is used to provide API documentation and interactive API testing
app.use("/docs", swaggerUi.serve, async (_req: ExRequest, res: ExResponse) => {
    return res.send(
        swaggerUi.generateHTML(await import("./swagger/swagger.json"))
    );
});

// Register all generated routes on the Express application
RegisterRoutes(app);

app.use(errorHandler);

export default app;