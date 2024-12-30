# Introduction
![Approach from Research Paper](./img/approach.png)

The goal of this paper was to create a model that can create objects from sketches without regard for the level of 
granularity that the sketches provide. Hence within the [research paper](https://arxiv.org/pdf/2307.03869), they 
typically discuss sketches of from a variety of sources.

# Zero Shot Transfer Learning
This paper uses the idea of zero shot transfer learning. This approach seeks to retain the details that larger models
preserver in their analytical image ability and aims to refine those embeddings into an 3d auto-encoder in order to 
create a relatively accurate shape.