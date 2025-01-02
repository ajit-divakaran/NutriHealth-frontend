import { commonApi } from "./commonApi"
import { serverUrl } from "./serverUrl"


export const RegisterApi = async(reqBody) =>{
    return await commonApi('POST',`${serverUrl}/register`,reqBody)
}
export const LoginApi = async(reqBody) =>{
    return await commonApi('POST',`${serverUrl}/login`,reqBody)
}
export const EditGoalsApi = async(reqBody,reqheader) =>{
    return await commonApi('PUT',`${serverUrl}/goals`,reqBody,reqheader)
}
// export const GetFoodsApi = async(searchkey) =>{
//     return await commonApi('GET',`${serverUrl}/all-foods?search=${searchkey}`)
// }
export const GetAllFoodsApi = async(reqheader) =>{
    return await commonApi('GET',`${serverUrl}/user-recipes`,"",reqheader)
}

export const GetSearchFoodsinAddrecipesApi = async(searchkey) =>{
    return await commonApi('GET',`${serverUrl}/all-foods?search=${searchkey}`)
}
export const AddUserRecipeApi = async(reqBody,reqheader) =>{
    return await commonApi('POST',`${serverUrl}/add-new-recipe`,reqBody,reqheader)
}

export const EditUserRecipeApi = async(foodID,reqBody,reqheader) =>{
    return await commonApi('PUT',`${serverUrl}/edit-user-recipe/${foodID}`,reqBody,reqheader)
}

export const DeleteUserFoodApi = async(foodID,reqheader) =>{
    return await commonApi('DELETE',`${serverUrl}/delete-user-recipe/${foodID}`,{},reqheader)
}

export const FindUSDAFoodApi = async(datatype,searchval) =>{
    console.log(searchval)
    return await commonApi('GET',`${serverUrl}/usda-foods/${datatype}/list?search=${searchval}`)
}

export const AddSearchCacheFoodsApi = async(reqBody,reqheader) =>{
    return await commonApi('POST',`${serverUrl}/add-search-foods`,reqBody,reqheader)
}

export const EditUserMealApi = async(reqBody,reqheader) =>{
    return await commonApi('POST',`${serverUrl}/edit-user-meal`,reqBody,reqheader)
}

export const AddUSDAEditedImageApi = async(reqBody,reqheader) =>{
    return await commonApi('POST',`${serverUrl}/add-usda-edit-images`,reqBody,reqheader)
}

