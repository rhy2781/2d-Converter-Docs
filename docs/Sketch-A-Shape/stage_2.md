# Stage 2 Training
The Stage 2 training involves integrating a pre-existing model and training an additional model in order to create the 
proper shape embeddings based on the model trained in Stage 1. This involves generating images of the same data set, and 
having our second model pick up on the embeddings produced by the large image/text pre-trained model in order to leverage
zero shot transfer learning.