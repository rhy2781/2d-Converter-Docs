# Stage I Auto-Encoder
For Stage I, we train our own auto-encoder that is capable of compressing/decompressing 3d objects. 

## Dataset
For this model, we leverage the ShapeNet data set that is available on hugging faces. The information for this can be
found [here](https://shapenet.org). Anyone can create an account and request access to this dataset.
### Binary Voxel Representation
While there are multiple forms for this 3d shape data, we leverage the binary voxel representation for simplicity. This
format is stored in [.binvox files](https://www.patrickmin.com/binvox/). A python script to read and write .binvox files
is available on on [Github](https://github.com/dimatura/binvox-rw-py/blob/public/binvox_rw.py)


## Auto-Encoder Structure
The auto encoder implements the VQVAE architecture that is presented in this 
[Research Paper](https://arxiv.org/abs/1711.00937) We go on to also take into account the implementation details
presented in Section C of the [Original Paper](https://arxiv.org/abs/2307.03869). 
A simple pytorch implementation was adopted from this [Github](https://github.com/airalcorn2/vqvae-pytorch)

### Encoder
For the encoder, we take our original shape size of 128 x 128 x 128 and reduce this down to 8 x 8 x 8. This additionally
produces 64 output channels that we use for the vector quantized portion of the auto-encoder

### Vector Quantized
We then quantize the result of our encoding process in order to guide the shape embeddings towards a shape that is 
plausible given all the data that our model has seen.

### Decoder
For the decoder section, we take the quantized vector and we upscale the size to a 32 x 32 x 32 grid size and an output
channel of 1 which denotes whether or not the voxel block is present in the decompressed image