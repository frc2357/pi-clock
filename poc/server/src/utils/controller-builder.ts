import { NextFunction, Request, RequestHandler, Response } from "express"
import { ZodSchema } from "zod"

/**
 * The purpose of this class is to reduce code duplication in controller methods
 * A lot of controller methods use the same structure but with different data/variables
 */
export default class ControllerBuilder {
    // ZodSchema to use for input validation
    private inputValidationSchema?: ZodSchema
    // service method to call
    private serviceMethod?: Function

    // code to return when input validation and service call succeed
    private successCode: number = 200
    // code to return when an error happens when parsing inputValidationSchema
    private validationErrorCode: number = 422
    // code to return when an error happens
    private defaultErrorCode: number = 500

    public validatesWith(schema: ZodSchema): this {
        this.inputValidationSchema = schema
        return this
    }

    public calls(serviceMethod: Function): this {
        this.serviceMethod = serviceMethod
        return this
    }

    public onSuccess(code: number): this {
        this.successCode = code
        return this
    }

    public onValidationError(code: number): this {
        this.validationErrorCode = code
        return this
    }

    public onError(code: number): this {
        this.defaultErrorCode = code
        return this
    }

    public build(): RequestHandler {
        const inputValidationSchema: ZodSchema|undefined = this.inputValidationSchema
        const serviceMethod: Function = this.serviceMethod || (() => null)
        const successCode: number = this.successCode
        const validationErrorCode: number = this.validationErrorCode
        const defaultErrorCode: number = this.defaultErrorCode

        const validateRequest = inputValidationSchema
            ? (async (req: Request, res: Response, next: NextFunction) => {
                    try {
                        return inputValidationSchema.parse(req)
                    } catch (error) {
                        res.status(validationErrorCode).json(error)
                        next()
                    }
            })
            : ((req: Request, res: Response, next: NextFunction) => null)

        return async (req: Request, res: Response, next: NextFunction) => {
            try {
                const input = await validateRequest(req, res, next)
                const result = await serviceMethod(input)
                res.status(successCode).json(result)
                next()
            } catch (error) {
                res.status(defaultErrorCode).json(error)
                next()
            }
        }
    }
}