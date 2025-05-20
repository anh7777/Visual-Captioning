from torchvision.models import resnet50, ResNet50_Weights
import torch
import torch.nn as nn


class EncoderCNN(nn.Module):
    def __init__(self, embed_size, dropout=0.5):
        super().__init__()
        resnet = resnet50(weights=ResNet50_Weights.DEFAULT)
        self.resnet = nn.Sequential(*list(resnet.children())[:-2])
        self.linear = nn.Sequential(
            nn.Conv2d(resnet.fc.in_features, embed_size, kernel_size=1, padding=0),
            nn.Dropout2d(dropout)
        )

    def forward(self, images, keep_cnn_gradients=False):
        if keep_cnn_gradients:
            raw_conv_feats = self.resnet(images)
        else:
            with torch.no_grad():
                raw_conv_feats = self.resnet(images)
        features = self.linear(raw_conv_feats)
        return features.view(features.size(0), features.size(1), -1)


class EncoderLabels(nn.Module):
    def __init__(self, embed_size, num_classes, dropout=0.5, embed_weights=None, scale_grad=False):
        super().__init__()
        embedding_layer = nn.Embedding(
            num_classes,
            embed_size,
            padding_idx=num_classes - 1,
            scale_grad_by_freq=scale_grad
        )
        if embed_weights is not None:
            embedding_layer.weight.data.copy_(embed_weights)
        self.linear = embedding_layer
        self.pad_value = num_classes - 1
        self.dropout = dropout
        self.embed_size = embed_size

    def forward(self, x, onehot_flag=False):
        embeddings = torch.matmul(x, self.linear.weight) if onehot_flag else self.linear(x)
        embeddings = nn.functional.dropout(embeddings, p=self.dropout, training=self.training)
        return embeddings.permute(0, 2, 1).contiguous()