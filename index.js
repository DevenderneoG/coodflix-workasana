const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { ObjectId } = require("mongoose").Types;
const app = express();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

const { initializeDatabase } = require("./db/db.connect");
const Lead = require("./models/lead.models");
const SalesAgent = require("./models/salesAgent.models");
const Comment = require("./models/comment.models");

app.use(express.json());

initializeDatabase();

//Leads API's
// create new lead
async function createLead(newLead) {
  try {
    const lead = new Lead(newLead);
    const saveLead = await lead.save();    
  } catch (error) {
    throw error;
  }
}

app.post("/leads", async (req, res) => {
  try {
    const savedLeads = await createLead(req.body);
    res.status(201).json({ message: "Creates a new lead", lead: savedLeads });
  } catch (error) {
    if (error.message.includes("name is required")) {
      return res
        .status(400)
        .json({ error: "Invalid input: 'name' is required." });
    }
    if (error.message.includes("Sales agent")) {
      return res.status(404).json({
        error: "Sales agent with ID '64c34512f7a60e36df44' not found.",
      });
    }
    res.status(500).json({ error: "Failed to add lead." });
  }
});

//fetch all leads

async function readAllLeads() {
  try {
    const readLeads = await Lead.find();
    return readLeads;
  } catch (error) {
    throw error;
  }
}

app.get("/leads", async (req, res) => {
  try {
    const leads = await readAllLeads();
    if (leads.length != 0) {
      res.json(leads);
    } else {
      res.status(404).json({ error: "No Leads found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leads." });
  }
});

// Fetch leads by id

async function getLeadsById(leadId) {
  try {
    const leadById = await Lead.findById(leadId);
    return leadById;
  } catch (error) {
    throw error;
  }
}

app.get("/leads/:leadId", async (req, res) => {
  try {
    const getLeadById = await getLeadsById(req.params.leadId);
    if (getLeadById) {
      res.json(getLeadById);
    } else {
      res.status(404).json({ error: "No lead found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lead." });
  }
});

// Fetch leads by sales agent

async function getLeadsBySalesAgent(salesAgentId) {
  try {
    if (!ObjectId.isValid(salesAgentId)) {
      throw new Error("Invalid salesAgent ID");
    }
    const leadsBySales = await Lead.find({
      salesAgent: new ObjectId(salesAgentId),
    });
    return leadsBySales;
  } catch (error) {
    throw error;
  }
}

app.get("/leads/salesAgent/:id", async (req, res) => {
  try {
    const salesAgent = await getLeadsBySalesAgent(req.params.id);
    if (salesAgent.length === 0) {
      return res
        .status(404)
        .json({ error: "No leads found for this sales agent" });
    }
    res.json(salesAgent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// get leads from lead status

async function getLeadsByStatus(statusName) {
  try {
    const leadStatus = await Lead.find({ status: statusName });    
    return leadStatus;
  } catch (error) {
    throw error;
  }
}

app.get("/leads/status/:statusname", async (req, res) => {
  try {
    const getStatusLead = await getLeadsByStatus(req.params.statusname);    
    if (getStatusLead != 0) {
      res.json(getStatusLead);
    } else {
      res
        .status(400)
        .json({
          error:
            "Invalid input: 'status' must be one of ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'].",
        });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch lead from status." });
  }
});

// get leads from lead tag

async function getLeadsByTag(tagName) {
  try {
    const leadTag = await Lead.find({ tags: tagName });
    return leadTag;
  } catch (error) {
    throw error;
  }
}

app.get("/leads/tags/:tagname", async (req, res) => {
  try {
    const getTagLead = await getLeadsByTag(req.params.tagname);
    if (getTagLead.length > 0) {
      res.json(getTagLead);
    } else {
      res.status(404).json({ error: "No leads found with this tag." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leads by tag." });
  }
});

// get leads from lead source

async function getLeadsBySource(sourceName) {
  try {
    const leadSource = await Lead.find({ source: sourceName });    
    return leadSource;
  } catch (error) {
    throw error;
  }
}

app.get("/leads/source/:sourcename", async (req, res) => {
  try {
    const getSourceLead = await getLeadsBySource(req.params.sourcename);
    if (getSourceLead.length > 0) {
      res.json(getSourceLead);
    } else {
      res.status(404).json({ error: "No leads found with this source." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leads by source." });
  }
});

// Update lead by ID

async function updateLeadById(leadId, updateData) {
  try {
    const updatedLead = await Lead.findByIdAndUpdate(leadId, updateData, {
      new: true,
    });
    return updatedLead;
  } catch (error) {
    throw error;
  }
}

app.put("/leads/:leadId", async (req, res) => {
  try {
    const leadUpdatedById = await updateLeadById(req.params.leadId, req.body);
    if (leadUpdatedById) {
      res
        .status(200)
        .json({
          message: "Lead updated successfully.",
          leadUpdatedById: leadUpdatedById,
        });
    } else {
      res.status(404).json({ message: "Lead not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update Hotel." });
  }
});

// Delete lead by id

async function deleteLeadById(leadId) {
  try {
    const deletedLead = await Lead.findByIdAndDelete(leadId);
    return deletedLead; // ✅ return it!
  } catch (error) {
    throw error; // ✅ rethrow so the route handler can catch
  }
}

app.delete("/leads/:leadId", async (req, res) => {
  try {
    const deletedLead = await deleteLeadById(req.params.leadId);

    if (deletedLead) {
      res.status(200).json({ message: "Lead deleted successfully." });
    } else {
      res
        .status(404)
        .json({ error: `Lead with ID '${req.params.leadId}' not found.` });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete lead." });
  }
});

//Sales Agents API's

async function createSalesAgents(newAgent) {
  try {
    const agent = new SalesAgent(newAgent);
    const saveAgent = await agent.save();    
  } catch (error) {
    throw error;
  }
}

app.post("/agents", async (req, res) => {
  try {
    const savedAgents = await createSalesAgents(req.body);
    res.status(201).json({
      message: "New Sales agent creates successfully",
      agent: savedAgents,
    });
  } catch (error) {
    if (error.message.includes("email must be a valid email address.")) {
      return res.status(400).json({
        error: "Invalid input: 'email' must be a valid email address.",
      });
    }
    if (error.message.includes("Sales agent")) {
      return res.status(409).json({
        error: "Sales agent with email 'john@example.com' already exists.",
      });
    }
    res.status(500).json({ error: "Failed to add Sales agent." });
  }
});

//get Sales agent

async function readAllAgents() {
  try {
    const getAgents = await SalesAgent.find();
    return getAgents;
  } catch (error) {
    throw error;
  }
}

app.get("/agents", async (req, res) => {
  try {
    const agents = await readAllAgents();
    if (agents.length != 0) {
      res.json(agents);
    } else {
      res.status(404).json({ error: "No Agents found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Agents." });
  }
});

// Delete sales agents by id

async function deleteAgentById(agentId) {
  try {
    const deletedAgent = await SalesAgent.findByIdAndDelete(agentId);
    return deletedAgent;
  } catch (error) {
    throw error;
  }
}

app.delete("/agents/:agentId", async (req, res) => {
  try {
    const deletedAgentId = await deleteAgentById(req.params.agentId);

    if (deletedAgentId) {
      res.status(200).json({ message: "Agent deleted successfully." });
    } else {
      res
        .status(404)
        .json({ error: `Lead with ID '${req.params.agentId}' not found.` });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Agent." });
  }
});

//Add a comment

// Helper function to create and save a comment
async function createComment(newComment) {
  try {
    const comment = new Comment(newComment);
    const savedComment = await comment.save();    
    return savedComment;
  } catch (error) {
    throw error;
  }
}

// Route: POST /leads/:id/comments
app.post("/leads/:id/comments", async (req, res) => {
  try {
    const leadId = req.params.id;
    const { author, commentText } = req.body;

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      return res.status(400).json({ error: "Invalid lead ID." });
    }

    if (!mongoose.Types.ObjectId.isValid(author)) {
      return res.status(400).json({ error: "Invalid author ID." });
    }

    if (!commentText || typeof commentText !== "string") {
      return res
        .status(400)
        .json({ error: "'commentText' is required and must be a string." });
    }

    const leadExists = await Lead.exists({ _id: leadId });
    const authorDoc = await SalesAgent.findById(author);

    if (!leadExists) {
      return res
        .status(404)
        .json({ error: `Lead with ID '${leadId}' not found.` });
    }

    if (!authorDoc) {
      return res.status(404).json({ error: `Author (SalesAgent) not found.` });
    }

    const savedComment = await createComment({
      lead: leadId,
      author,
      commentText,
    });    

    // ✅ Final response format
    res.status(201).json({
      id: savedComment._id,
      commentText: savedComment.commentText,
      author: authorDoc.name,
      createdAt: savedComment.createdAt,
    });
  } catch (error) {
    console.error("Comment creation error:", error);
    res.status(500).json({ error: "Failed to add comment." });
  }
});

//Fetch all comments
// ✅ Helper function to get comments for a lead
async function getCommentsByLeadId(leadId) {
  try {
    const comments = await Comment.find({ lead: leadId })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    return comments.map((comment) => ({
      id: comment._id,
      commentText: comment.commentText,
      author: comment.author.name,
      createdAt: comment.createdAt,
    }));
  } catch (error) {
    throw error;
  }
}

// ✅ Route: GET /leads/:id/comments
app.get("/leads/:id/comments", async (req, res) => {
  const leadId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(leadId)) {
    return res.status(400).json({ error: "Invalid lead ID." });
  }

  try {
    const comments = await getCommentsByLeadId(leadId);

    if (comments.length === 0) {
      return res
        .status(404)
        .json({ error: "No comments found for this lead." });
    }

    res.status(200).json(comments);
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    res.status(500).json({ error: "Failed to fetch comments." });
  }
});

// Helper: Get leads closed in last 7 days
async function getLeadsClosedLastWeek() {
  try {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const leads = await Lead.find({
      status: "Closed",
      closedAt: { $gte: oneWeekAgo },
    }).sort({ closedAt: -1 });

    return leads.map((lead) => ({
      id: lead._id,
      name: lead.name,
      source: lead.source,
      status: lead.status,
      closedAt: lead.closedAt,
      priority: lead.priority,
    }));
  } catch (error) {
    throw error;
  }
}

// ✅ Route: GET /report/last-week
app.get("/report/last-week", async (req, res) => {
  try {
    const closedLeads = await getLeadsClosedLastWeek();

    if (closedLeads.length === 0) {
      return res
        .status(404)
        .json({ error: "No leads closed in the last 7 days." });
    }

    res.status(200).json(closedLeads);
  } catch (error) {
    console.error("Failed to fetch closed leads:", error);
    res.status(500).json({ error: "Failed to fetch closed leads." });
  }
});

// ✅ Helper: Get total leads in pipeline (status !== 'Closed')
async function getPipelineLeadsCount() {
  try {
    const count = await Lead.countDocuments({ status: { $ne: "Closed" } });
    return count;
  } catch (error) {
    throw error;
  }
}

// ✅ Route: GET /report/pipeline
app.get("/report/pipeline", async (req, res) => {
  try {
    const count = await getPipelineLeadsCount();

    res.status(200).json({
      totalLeadsInPipeline: count,
    });
  } catch (error) {    
    res.status(500).json({ error: "Failed to fetch pipeline leads." });
  }
});

// Connect to MongoDB and start the server

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
