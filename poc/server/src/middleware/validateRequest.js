export const validateRequest = (schema) => (req, res, next) => {
    const result = schema.safeParse(req)

    if (!result.success) {
        return res.status(422).json({ error: result.error.flatten() })
    }

    next()
}