const responseWithData = (res, statusCode, data) => res.status(statusCode).json(data);

const error = (res) => responseWithData(res, 500, {
    status: 500,
    message: res.message || "Internal server error"
})

const badrequest = (res, message) => responseWithData(res, 400, {
    status: 400,
    message
})

const oke = (res, data) => responseWithData(res, 200, data);
const created = (res, data) => responseWithData(res, 201, data);

const unauthorize = (res) => responseWithData(res, 401, {
    status: 401,
    message: "Unauthorized"
})

const notfound = (res) => responseWithData(res, 404, {
    status: 404,
    message: "Resource not found"
})

export default {
    error,
    badrequest,
    oke,
    created,
    unauthorize,
    notfound
}