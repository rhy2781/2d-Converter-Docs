# For Beginners
Welcome to the **Sketch-A-Shape Machine Learning Documentation**! This page is designed for those who want to gain a high-level understanding of how the machine learning model behind Sketch-A-Shape works, without requiring any prior background knowledge. 

If you're looking for more **in-depth technical details**, we recommend starting with the [**Introduction Page**](introduction.md) and then proceeding to the [**Stage I Auto-Encoder**](stage_1.md) and [**Stage II - Prior Model**](stage_2.md) pages, where you'll find comprehensive explanations and step-by-step breakdowns of the system's development and implementation.

## Objective + Overview  

Create **3D shapes** from sketches of varying complexity using **only computer-generated images**, without requiring a **paired dataset of sketch/shape**—unlike approaches such as **Pixel Mesh**.

---

## Training  

### Stage 1  
- Shapes are converted into a **sequence of symbols** (*shape embeddings, Z*) using an **autoencoder**.  

### Stage 2  
- A **transformer model** learns to predict these symbols based on **features extracted from rendered images**.  
- These features are derived from a **pre-trained model**.


## Shape Generation  

- During shape generation, the **transformer model** uses the sketch to **iteratively predict the shape embedding** (*compact numerical representations of 3D shapes*—think of shapes represented as numerical data).  
- Finally, the **autoencoder’s decoder** converts these embeddings into a **3D shape**.


---

## Training Discrete Autoencoder

### Refer back to Stage 1
In Stage 1, the **autoencoder** is used to compress the 3D shapes into a sequence of meaningful numerical data representation called the **“shape embedding”**. To do this, a specific type of autoencoder called **VQ-VAE (Vector Quantized Variational Auto-Encoder)** is used.

---

### What is an Autoencoder?

In simple terms, an **autoencoder** is a type of machine learning model that learns to compress data into a smaller representation and then reconstruct it back to its original form. It works by first encoding the data into a compact, lower-dimensional format and then decoding it to recover the original data as closely as possible. Since autoencoders typically work with **unlabeled data**, they are considered an **unsupervised learning model**.

---

### How does that make sense?

By compressing information, it forces the model to learn to extract the most important features from the input. The autoencoder at the start may be bad at reconstruction, but with training, it minimizes the **“reconstruction loss”** by adjusting internal parameters.

---

### How can it train on data and improve without adding more data?

Even with the same data, it’s possible to improve because it **iteratively learns with epochs** (a single pass through the training dataset). During each epoch, the autoencoder processes the data, adjusts with the loss (reconstruction error), and backpropagates the information to adjust weights using an optimizer. With more epochs, the model gets fine-tuned, although after a certain number of epochs, the adjustment in loss becomes minimal, making further adjustments not worth the time.

---

### This still doesn't make sense, could you give an example?

To generalize things, **autoencoders** are really good at learning how to **“reconstruct something”**. 

Think of it this way: You are given a **Lego car** and told to learn how to build it. With no instructions, you would learn by taking it apart and putting it together a bunch of times. At first, you might be slow and make mistakes, but eventually, you would get really good at building this Lego car with high accuracy. This is essentially the **decode/encode** aspect of the autoencoder.

Now, someone comes along and hands you the Lego pieces for a **different Lego car** and tells you to build the car! You don’t have any instructions again, but since you learned how to put together a Lego car in the past, you are able to apply that knowledge and build the new car! It might not be a perfect result, but you would most likely be able to create something resembling a car with those pieces!

Now, imagine you learned how to reconstruct **a lot of different objects** instead of just a car—you could basically make anything you were asked to make! This is what we are aiming for when we provide a **wide variety of training data** to the model.

---

### So about that VQ-VAE?

**Vector Quantized Variational Autoencoders** (VQ-VAE) bring the idea of object reconstruction to the next level. Instead of just learning how to build and rebuild the Lego car directly, you are given a special instructions book with a finite set of **building patterns** (like how to make wheels, doors, engines). Each of these patterns is assigned a unique code in the instruction book. When you see a new Lego creation, instead of memorizing each single piece’s position, you translate it into those pre-learned patterns and their corresponding codes.

This is essentially what the **VQ-VAE** does: it compresses complex data (like a 3D shape) into a **discrete set of symbols** from a **predefined dictionary**.

When it’s time to reconstruct the object, you use these codes from the instructions book to recreate the original structure. This approach makes the model more efficient and scalable as it focuses on reusing a set of meaningful **“building blocks”** rather than trying to understand and memorize every tiny detail.

Overall, **VQ-VAE** breaks down data into **reusable pieces**, allowing for better reconstruction quality and a more interpretable representation!

---

### Now going back to how we train it:

Now that we have established that we are using a **VQ-VAE**, to train the model we first need a **3D shape (S)** and an **encoder (E)** which converts it into a sequence of **discrete indices (Z)**.

- Formula:  
  `Z = VQ(E(S))`

A **decoder (D)** then reconstructs the shape (**S’**) from these indices.

- Formula:  
  `S’ = D(Z)`

A **reconstruction loss (Lrec)** is generated to ensure the reconstructed shape matches the original.

A **commitment loss** encourages the encoder to stick to a specific dictionary entry.

An **exponential moving average** calculation ensures the dictionary entries gradually align with the encoder's outputs.

## (Stage 2) Masked Transformer

The goal of **Stage 2** is to train a model that can generate **shape indices (Z)** from a sketch during inference. To achieve this, we use a **bi-directional transformer network** that takes two main inputs:

- **Shape Indices (Z):** from Stage 1
- **Features from 3D Renderings (C):** Extracted from images of the shapes using a pre-trained model

---

### Masking Indices

During training, we **randomly mask** some shape indices (**Z**) with a special placeholder token, creating a masked version of **Z_msk**. The model’s task is to predict the missing indices using the available information from the sketch features (**C**).

The objective here is for the model to learn to reconstruct the original indices (**Z**) from the masked version while relying on the sketch features from (**C**). The **loss function** measures how accurately the model predicts these missing indices.

Additionally, at each training step, we randomly pick an **image view** of the 3D shape. This image is passed through a pre-trained model to extract features (meaningful details), and once these features are extracted, they are converted into a sequence using a simple mapping network (MLP layers).

---

### In Short
**Stage 2** trains a **transformer** to predict shape indices from sketches by leveraging powerful features from pre-trained models, then fine-tuning them with **cross attention** and **masking strategies**.

---

## Inference

Inference is the **generation phase**, where the sketch is first converted into a sequence of **local features** using the pre-trained model. These features act as guiding information for the transformer model.

### Iterative Decoding
Iterative decoding starts with a **fully masked** set of indices. At each step, the transformer predicts the unmasked shape sequence using the sketch features. A fraction of the most confident predictions are accepted and remain unmasked, while the rest are reset for the next iteration.

### Classifier-Free Guidance
This is also applied to refine predictors. This eventually leads to a final reconstruction of every token being unmasked, and a final sequence of tokens is passed through the **shape decoder** (from Stage 1), which reveals the final 3D object.

---
### Final Note

Ultimately, this process can be done multiple times with the same sketch to produce **different 3D shapes**. This ties into the concept of **zero-shot learning** (although the term was unused earlier, the concept should feel familiar!), where the model is able to generate new 3D shapes without having seen specific examples of them during training.

To connect this back to the Lego analogy: imagine you’ve learned how to build a Lego car using a set of instructions. Now, someone gives you a new set of Lego pieces, and you are able to apply what you learned about building a car and create something that resembles a car—**even though you've never seen this specific Lego car before**. Similarly, the model can generate new 3D shapes based on the general understanding it gained from the training data, without having seen exact examples of the shapes it’s being asked to generate.

By leveraging the pre-trained features and the learned embeddings from the **autoencoder** and **transformer model**, the system doesn’t require paired training data (like specific sketches matched with 3D shapes). Instead, it generalizes the learned representations to infer new shapes from previously unseen sketches—effectively working in a zero-shot setting. This allows the model to create a diverse set of 3D shapes based on the same input, making it highly versatile and capable of creative shape generation even with limited or no prior examples of the exact object being sketched.

Thus, the combination of the **VQ-VAE autoencoder** and the **masked transformer model** enables the system to handle not only **in-domain** data and enables flexible and scalable 3D shape generation.
