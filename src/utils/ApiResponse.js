class ApiResponse{
    constructor(statusCode,data,message="Success"){
        this.successCode=statusCode
        this.data=data
        this.message=message
        this.sucess=statusCode<400
    }
}