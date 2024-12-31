# Stage II - Prior Model
The purpose of this stage is to take the encoder section of a large pre-trained model and translate the semantic 
features into compressed shape embeddings that are consistent wih the Auto-Encoder that is trained in Stage I.

## Dataset
For this model, we render the objects from the [ShapeNet Dataset](https://shapenet.org) in different angles and create 
synthetic images. This allows us to have a matching shape embedding and correlating image form which extra layers can be
added so that the semantic features from the large pre-trained model are correctly translated into our shape embeddings.

## Structure
### Large Pre-Trained Model
The paper leverages the [CLIP model](https://arxiv.org/abs/2103.00020) trained by [OpenAI](https://github.com/openai/CLIP),
and the implementation of CLIP was taken from this [GitHub](https://github.com/mlfoundations/open_clip)

### Mapping Network

### Self-Attention Network

### MaskGIT Bi-Directional Transformer