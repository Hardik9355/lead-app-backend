import connectDB from "../config/db.js";
import Lead from "../models/leadDetails.js";
import { formatJSONResponse } from "../utills/ApiGateway.js";
import { authorize } from "./authorization.js";

export const createLeadDetails = async (event) => {
  try {
    await connectDB();

    const isAuthorized = await authorize(event);
    if (!isAuthorized) {
      return formatJSONResponse(403, { message: "Unauthorized" });
    }

    const body = JSON.parse(event.body);
    const lead = await new Lead(body);
    await lead.save();
    return formatJSONResponse(201, lead);
  } catch (error) {
    return formatJSONResponse(500, { message: "Internal Server Error" });
  }
};

export const updateLeadDetails = async (event) => {
  try {
    await connectDB();

    const isAuthorized = await authorize(event);
    if (!isAuthorized) {
      return formatJSONResponse(403, { message: "Unauthorized" });
    }
    const body = JSON.parse(event.body);
    const { id, ...updateData } = body;

    const lead = await Lead.findById(id);
    if (!lead) {
      return formatJSONResponse(404, { message: "Lead not found" });
    }

    Object.assign(lead, updateData);
    await lead.save();

    return formatJSONResponse(200, lead);
  } catch (error) {
    return formatJSONResponse(500, { message: "Internal Server Error" });
  }
};




export const deleteLeadDetails = async (event) => {
  try {
    await connectDB();

    const isAuthorized = await authorize(event);
    if (!isAuthorized) {
      return formatJSONResponse(403, { message: "Unauthorized" });
    }

    const { id } = event.pathParameters;

    const lead = await Lead.findById(id);
    if (!lead) {
      return formatJSONResponse(404, { message: "Lead not found" });
    }

    await lead.deleteOne();

    return formatJSONResponse(200, { message: "Lead deleted successfully" });
  } catch (error) {
    return formatJSONResponse(500, { message: "Internal Server Error" });
  }
};
export const getLeadDetails = async (event) => {
  try {
    await connectDB();
    

    const isAuthorized = await authorize(event);
    if (!isAuthorized) {
      return formatJSONResponse(403, { message: "Unauthorized" });
    }
    const { name, sortBy } = event.queryStringParameters || {}; 
    const queryFilter = name ? { name: { $regex: name, $options: "i" } } : {};

    const sortOptions = sortBy ? { [sortBy]: 1 } : {}; 
    
    const leads = await Lead.find(queryFilter)
    .collation({ locale: 'en', strength: 2 }) 
    .sort(sortOptions);



    return formatJSONResponse(200, leads);
  } catch (error) {
    return formatJSONResponse(500, { message: "Internal Server Error" });
  }
};
export const searchLeadDetails = async (event) => {
  try {
    await connectDB();

    const isAuthorized = await authorize(event);
    if (!isAuthorized) {
      return formatJSONResponse(403, { message: "Unauthorized" });
    }

    const { name } = event.queryStringParameters || {}; 
    if (!name) {
      return formatJSONResponse(400, { message: "Username is required" });
    }

    const leads = await Lead.find({ name: new RegExp(name, "i") }); 

    if (leads.length === 0) {
      return formatJSONResponse(404, { message: "No leads found" });
    }

    return formatJSONResponse(200, leads);
  } catch (error) {
    return formatJSONResponse(500, { message: "Internal Server Error" });
  }
};
