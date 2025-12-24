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
// const Lead = require("./models/lead.models");
// const SalesAgent = require("./models/salesAgent.models");
// const Project = require("./models/project.models");
const Team = require("./models/team.models");
const User = require("./models/user.models");
const Tag = require("./models/tags.models");
const Task = require("./models/task.models");

app.use(express.json());

initializeDatabase();

// Create Projects
async function createProject(newProject) {
  try {
    const project = new Project(newProject);
    const saveProject = await project.save();
    console.log("New Project added", saveProject);
  } catch (error) {
    throw error;
  }
}

app.post("/project", async (req, res) => {
  try {
    const savedProject = await createProject(req.body);
    res
      .status(201)
      .json({ message: "Creates a new Project", project: savedProject });
  } catch (error) {
    res.status(500).json({ error: "Failed to add Project." });
  }
});

// Create Teams

async function createTeam(newTeam) {
  try {
    const team = new Team(newTeam);
    const saveTeam = await team.save();
    console.log("New Team added", saveTeam);
  } catch (error) {
    res.status(500).json({ error: "Failed to add Project." });
  }
}

app.post("/team", async (req, res) => {
  try {
    const savedTeam = await createTeam(req.body);
    res.status(201).json({ message: "Create a new team", team: savedTeam });
  } catch (error) {
    res.status(500).json({ error: "Failed to add Team." });
  }
});

// User owner Modal API's

async function createUser(newUser) {
  try {
    const user = new User(newUser);
    const saveUser = await user.save();
    console.log("New User Owner Added", saveUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to add User." });
  }
}

app.post("/user", async (req, res) => {
  try {
    const savedUser = await createUser(req.body);
    res.status(201).json({ message: "Create a new user", user: savedUser });
  } catch (error) {
    res.status(500).json({ error: "Failed to add user." });
  }
});

// Tags Modal API's

async function createTag(newTag) {
  try {
    const tags = new Tag(newTag);
    const saveTag = await tags.save();
    console.log("New tag added", saveTag);
  } catch (error) {
    res.status(500).json({ error: "Failed to add User." });
  }
}

app.post("/tag", async (req, res) => {
  try {
    const savedTag = await createTag(req.body);
    res.status(201).json({ message: "Create a new tag", tag: savedTag });
  } catch (error) {
    res.status(500).json({ error: "Failed to add Tag." });
  }
});

// Tasks Modal API's
//Create task
async function createTask(newTask) {
  try {
    const task = new Task(newTask);
    const saveTask = await task.save();
    console.log("New task Added", saveTask);
  } catch (error) {
    res.status(500).json({ error: "Failed to add Task." });
  }
}

app.post("/task", async (req, res) => {
  try {
    const savedTasks = await createTask(req.body);
    res.status(201).json({ message: "Create a new task", task: savedTasks });
  } catch (error) {
    res.status(500).json({ error: "Failed to add tasks" });
  }
});

//Get tasks
async function readAllTasks() {
  try {
    const readtasks = await Task.find();
    return readtasks;
  } catch (error) {}
}

app.get("/tasks", async(req, res) => {
  try {
    const tasks = await readAllTasks();
    if(tasks.length != 0) {
      res.json(tasks);
    } else {
      res.status(404).json({ error: "No Tasks Found."});
    }
  } catch (error) {
     res.status(500).json({ error: "Failed to fetch leads." });
  }
})

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
//Sales Agents API's

async function createSalesAgents(newAgent) {
  try {
    const agent = new SalesAgent(newAgent);
    const saveAgent = await agent.save();
    console.log("New Agent Data", saveAgent);
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

// // readAllProducts();

// async function readProductById(productId) {
//   try {
//     const productById = await Product.findById(productId);
//     return productById;
//   } catch (error) {
//     console.log(error);
//   }
// }

// app.get("/products/:productId", async (req, res) => {
//   try {
//     const productById = await readProductById(req.params.productId);
//     if (productById) {
//       res.json(productById);
//     } else {
//       res.status(404).json({ error: "No product found." });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch product." });
//   }
// });

// async function readByCateogry() {
//   try {
//     const productByCategory = await Product.find();
//     return productByCategory;
//   } catch (error) {
//     throw error;
//   }
// }

// async function getProductsByCategory(category) {
//   try {
//     // Query the Product model to find products matching the category
//     const products = await Product.find({ category });

//     return products;
//   } catch (error) {
//     throw error; // Rethrow error so it can be caught by the calling function
//   }
// }

// async function getProductsByCategory() {
//   try {
//     // Fetch all products (you could apply additional filters if necessary)
//     const products = await Product.find(); // This will return all products

//     // Extract distinct categories using a Set to filter duplicates
//     const categories = new Set(products.map((product) => product.category));

//     // Convert the Set to an array and return
//     return Array.from(categories);
//   } catch (error) {
//     throw error; // Rethrow error to be handled by the route
//   }
// }

// app.get("/categories", async (req, res) => {
//   try {
//     // Get distinct categories from the database
//     const categories = await getProductsByCategory();

//     if (categories.length > 0) {
//       // If categories exist, return them in the response
//       return res.status(200).json({ categories });
//     } else {
//       // If no categories are found
//       return res.status(404).json({ error: "No categories found." });
//     }
//   } catch (error) {
//     // Handle any errors (e.g., database issues)
//     return res.status(500).json({ error: "Failed to fetch categories." });
//   }
// });

// async function getCategoryData(categoryId) {
//   try {
//     // Fetch products for the specific category (categoryId is a category name)
//     const categoryData = await Product.find({ category: categoryId });

//     if (categoryData.length === 0) {
//       throw new Error(
//         "Category not found or no products available for this category."
//       );
//     }

//     return categoryData;
//   } catch (error) {
//     throw error; // Rethrow the error to be handled by the route
//   }
// }

// app.get("/categories/:categoryId", async (req, res) => {
//   const { categoryId } = req.params; // Get categoryId from the URL parameter

//   try {
//     // Fetch category data based on the categoryId
//     const categoryData = await getCategoryData(categoryId);

//     // Return the category data in the response
//     return res.status(200).json({ data: { category: categoryData } });
//   } catch (error) {
//     // Handle errors: no products found, category not found, etc.
//     if (
//       error.message ===
//       "Category not found or no products available for this category."
//     ) {
//       return res.status(404).json({ error: error.message });
//     }

//     // Internal server error
//     return res.status(500).json({ error: "Failed to fetch category data." });
//   }
// });

// async function readWishlist() {
//   try {
//     const wishlist = await Wishlist.findOne().populate("items.productId");
//     return wishlist;
//   } catch (error) {
//     throw error;
//   }
// }

// Assuming Express setup is done
// app.get("/wishlist", async (req, res) => {
//   try {
//     const wishlist = await readWishlist(); // Use the separate function
//     if (!wishlist) {
//       return res.status(404).json({ error: "Wishlist not found." });
//     }
//     res.json(wishlist); // Send the wishlist as JSON
//   } catch (error) {
//     console.error("Error fetching wishlist:", error);
//     res.status(500).json({ error: "Failed to fetch wishlist." });
//   }
// });

// async function addToWishlist(productId) {
//   try {
//     // Find the first wishlist (or create one)
//     let wishlist = await Wishlist.findOne();

//     if (!wishlist) {
//       // If no wishlist exists, create a new one
//       wishlist = new Wishlist({
//         items: [{ productId }],
//       });
//     } else {
//       // If wishlist exists, add the product to the items
//       wishlist.items.push({ productId });
//     }

//     // Save the wishlist to the database
//     const savedWishlist = await wishlist.save();

//     // Return the saved wishlist object for confirmation
//     console.log("Updated Wishlist:", savedWishlist);
//     return savedWishlist;
//   } catch (error) {
//     console.error("Error adding product to wishlist:", error.message);
//     throw new Error("Failed to add product to wishlist.");
//   }
// }

// app.post("/wishlist", async (req, res) => {
//   try {
//     const { productId } = req.body; // Get productId from the request body

//     if (!productId) {
//       return res.status(400).json({ error: "Product ID is required." });
//     }

//     const updatedWishlist = await addToWishlist(productId);

//     res.status(201).json({
//       message: "Product added to wishlist successfully!",
//       wishlist: updatedWishlist,
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: error.message || "Failed to add product to wishlist." });
//   }
// });

// app.delete('/wishlist/:wishlistId/item/:productId', async (req, res) => {
//   try {
//     const { wishlistId, productId } = req.params;

//     console.log('DELETE request received - Wishlist ID:', wishlistId, 'Product ID:', productId);

//     if (!ObjectId.isValid(wishlistId) || !ObjectId.isValid(productId)) {
//       return res.status(400).json({ error: 'Invalid Wishlist ID or Product ID' });
//     }

//     const updatedWishlist = await Wishlist.findByIdAndUpdate(
//       wishlistId,
//       { $pull: { items: { productId: new ObjectId(productId) } } }, // Convert to ObjectId
//       { new: true }
//     ).populate('items.productId');

//     console.log('Updated Wishlist:', updatedWishlist);

//     if (!updatedWishlist) {
//       console.log('No wishlist found for ID:', wishlistId);
//       return res.status(404).json({ error: 'Wishlist not found' });
//     }

//     // Check if the item was removed
//     const itemStillExists = updatedWishlist.items.some(
//       (item) => item.productId.toString() === productId
//     );
//     if (itemStillExists) {
//       console.log('Item with Product ID:', productId, 'not removed from Wishlist:', wishlistId);
//       return res.status(404).json({ error: 'Product not found in wishlist or not removed' });
//     }

//     res.status(200).json({
//       message: 'Item removed from wishlist successfully',
//       updatedWishlist: updatedWishlist,
//     });
//   } catch (error) {
//     console.error('Error in DELETE route:', error.message);
//     res.status(500).json({ error: 'Failed to remove item from wishlist', details: error.message });
//   }
// });

// async function readCart() {
//   try {
//       const cart = await Cart.findOne().populate("items.productId");
//       return cart;
//   } catch (error) {
//       throw error;
//   }
// }

// app.get("/cart", async (req, res) => {
//   try {
//       const cart = await readCart();
//       if (!cart) {
//           return res.status(404).json({ error: "Cart not found." });
//       }
//       res.json(cart);
//   } catch (error) {
//       console.error("Error fetching cart:", error);
//       res.status(500).json({ error: "Failed to fetch cart." });
//   }
// });

// // Cart add function
// async function addToCart(productId, quantity = 1) {
//   try {
//       // Find the first cart (or create one)
//       let cart = await Cart.findOne();

//       if (!cart) {
//           // If no cart exists, create a new one
//           cart = new Cart({
//               items: [{ productId, quantity }],
//           });
//       } else {
//           // Check if product already exists in cart
//           const itemIndex = cart.items.findIndex(
//               item => item.productId.toString() === productId.toString()
//           );

//           if (itemIndex > -1) {
//               // If product exists, update quantity
//               cart.items[itemIndex].quantity += quantity;
//           } else {
//               // If product doesn't exist, add it
//               cart.items.push({ productId, quantity });
//           }
//       }

//       // Save the cart to the database
//       const savedCart = await cart.save();

//       // Return the saved cart object for confirmation
//       console.log("Updated Cart:", savedCart);
//       return savedCart;
//   } catch (error) {
//       console.error("Error adding product to cart:", error.message);
//       throw new Error("Failed to add product to cart.");
//   }
// }

// POST Cart API endpoint
// app.post("/cart", async (req, res) => {
//   try {
//       const { productId, quantity } = req.body; // Get productId and quantity from request body

//       if (!productId) {
//           return res.status(400).json({ error: "Product ID is required." });
//       }

//       // Validate quantity if provided
//       const qty = quantity && !isNaN(quantity) && quantity > 0 ? quantity : 1;

//       const updatedCart = await addToCart(productId, qty);

//       res.status(201).json({
//           message: "Product added to cart successfully!",
//           cart: updatedCart,
//       });
//   } catch (error) {
//       res.status(500).json({
//           error: error.message || "Failed to add product to cart."
//       });
//   }
// });

// app.delete('/cart/:cartId/item/:productId', async (req, res) => {
//   try {
//       const { cartId, productId } = req.params;

//       console.log('DELETE request received - Cart ID:', cartId, 'Product ID:', productId);

//       if (!mongoose.Types.ObjectId.isValid(cartId) || !mongoose.Types.ObjectId.isValid(productId)) {
//           return res.status(400).json({ error: 'Invalid Cart ID or Product ID' });
//       }

//       const updatedCart = await Cart.findByIdAndUpdate(
//           cartId,
//           { $pull: { items: { productId: new mongoose.Types.ObjectId(productId) } } },
//           { new: true }
//       ).populate('items.productId');

//       console.log('Updated Cart:', updatedCart);

//       if (!updatedCart) {
//           console.log('No cart found for ID:', cartId);
//           return res.status(404).json({ error: 'Cart not found' });
//       }

//       // Check if the item was removed
//       const itemStillExists = updatedCart.items.some(
//           item => item.productId.toString() === productId
//       );
//       if (itemStillExists) {
//           console.log('Item with Product ID:', productId, 'not removed from Cart:', cartId);
//           return res.status(404).json({ error: 'Product not found in cart or not removed' });
//       }

//       res.status(200).json({
//           message: 'Item removed from cart successfully',
//           updatedCart: updatedCart,
//       });
//   } catch (error) {
//       console.error('Error in DELETE cart route:', error.message);
//       res.status(500).json({ error: 'Failed to remove item from cart', details: error.message });
//   }
// });

// async function updateCartItemQuantity(cartId, productId, quantity) {
//   try {
//     // Validate inputs
//     if (!mongoose.Types.ObjectId.isValid(cartId)) {
//       throw new Error('Invalid Cart ID');
//     }
//     if (!mongoose.Types.ObjectId.isValid(productId)) {
//       throw new Error('Invalid Product ID');
//     }
//     if (!quantity || isNaN(quantity) || quantity < 1) {
//       throw new Error('Quantity must be a number greater than 0');
//     }

//     // Check if cart exists
//     const cart = await Cart.findById(cartId);
//     if (!cart) {
//       throw new Error('Cart not found');
//     }

//     // Check if product exists in cart
//     const itemExists = cart.items.some(item => item.productId.toString() === productId);
//     if (!itemExists) {
//       throw new Error('Product not found in cart');
//     }

//     // Update the quantity
//     const updatedCart = await Cart.findOneAndUpdate(
//       { _id: cartId, 'items.productId': productId },
//       { $set: { 'items.$.quantity': quantity } },
//       { new: true, runValidators: true }
//     ).populate('items.productId');

//     return updatedCart;
//   } catch (error) {
//     console.error('Error in updating cart item quantity:', error.message);
//     throw error; // Re-throw to let the caller handle it
//   }
// }

// PATCH endpoint for updating cart item quantity
// app.patch('/cart/:cartId/item/:productId', async (req, res) => {
//   try {
//     const { cartId, productId } = req.params;
//     const { quantity } = req.body;

//     console.log('PATCH request received - Cart ID:', cartId, 'Product ID:', productId, 'New Quantity:', quantity);

//     const updatedCart = await updateCartItemQuantity(cartId, productId, quantity);

//     res.status(200).json({
//       message: 'Cart item quantity updated successfully',
//       updatedCart: updatedCart
//     });
//   } catch (error) {
//     if (error.message === 'Invalid Cart ID' || error.message === 'Invalid Product ID') {
//       return res.status(400).json({ error: error.message });
//     }
//     if (error.message === 'Quantity must be a number greater than 0') {
//       return res.status(400).json({ error: error.message });
//     }
//     if (error.message === 'Cart not found' || error.message === 'Product not found in cart') {
//       return res.status(404).json({ error: error.message });
//     }
//     res.status(500).json({
//       error: 'Failed to update cart item quantity',
//       details: error.message
//     });
//   }
// });

/* Address Endpoint  */

// async function createAddress(newAddress) {
//   try {
//     const address = new Address(newAddress);
//     const saveAddress = await address.save();
//     console.log("New Address Data", saveAddress);
//   } catch (error) {
//     throw error;
//   }
// }

// app.post("/address", async (req, res) => {
//   try {
//     const savedAddress = await createAddress(req.body);
//     res
//       .status(201)
//       .json({ message: "Address Added successfully.", address: savedAddress });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to add address." });
//   }
// });

// async function readAllAddress() {
//   try {
//     const readAddress = await Address.find();
//     return readAddress;
//   } catch (error) {
//     throw error;
//   }
// }

// app.get("/address", async (req, res) => {
//   try {
//     const address = await readAllAddress();
//     if (address.length != 0) {
//       res.json(address);
//     } else {
//       res.status(404).json({ error: "No address found." });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch address." });
//   }
// })

// app.put("/address/:addressId", async (req, res) => {
//   try {
//      const updateAddressById = await readAddressById(req.params.addressId, req.body) ;
//      if(updateAddressById) {
//       res.status(200).json({message: "Address updated successfully.", updateAddressById: updateAddressById})
//      } else {
//       res.status(404).json({error: "Address does not exist."})
//      }
//   } catch (error) {
//       res.status(500).json({error: "Failed to update Address."})
//   }
// })

// async function readAddressById(addressId, dataToUpdate) {
//   try {
//       const addressUpdate = await Address.findByIdAndUpdate(addressId, dataToUpdate, {new: true});
//       return addressUpdate;
//   } catch (error) {
//       console.log("Error in updating Address data", error);
//   }
// }

// app.put("/address/:addressId", async (req, res) => {
//   try {
//     const updateAddressById = await readAddressById(req.params.addressId, req.body);
//     if (updateAddressById) {
//       res.status(200).json({
//         message: "Address updated successfully.",
//         updateAddressById: updateAddressById,
//       });
//     } else {
//       res.status(404).json({ error: "Address does not exist." });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Failed to update address." });
//   }
// });

// async function deleteAddressById (addressId) {
//   try {
//     const deleteAddress = await Address.findByIdAndDelete(addressId);
//     return deleteAddress;
//   } catch (error) {
//     console.log("Error in Deleting Address data", error)
//   }
// }

// app.delete("/address/:addressId", async (req, res) => {
//   try {
//     const deletedAddress = await deleteAddressById(req.params.addressId);
//     if (deletedAddress) {
//       res.status(200).json({message: "Address deleted successfully."})
//     } else {
//       res.status(404).json({error: "Address not found"});
//     }
//   } catch (error) {
//     res.status(500).json({error: "Failed to delete Address."})
//   }
// })

/* User Address  */

// async function createCustomer(newCustomer) {
//   try {
//     const customer = new User(newCustomer);
//     const saveCustomer = await customer.save();
//     console.log("New Customer Data", saveCustomer);
//   } catch (error) {
//     throw error;
//   }
// }

// app.post("/customer", async (req, res) => {
//   try {
//     const savedCustomer = await createCustomer(req.body);
//     res
//       .status(201)
//       .json({ message: "Customer Added successfully.", customer: savedCustomer });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to add Customer." });
//   }
// });

// async function readAllCustomer() {
//   try {
//     const readCustomer = await User.find();
//     return readCustomer;
//   } catch (error) {
//     throw error;
//   }
// }

// app.get("/customer", async (req, res) => {
//   try {
//     const customers = await readAllCustomer();
//     if (customers.length != 0) {
//       res.json(customers);
//     } else {
//       res.status(404).json({ error: "No customers found." });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Failed to fetch customers." });
//   }
// })

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
