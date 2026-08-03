import torch
import torch.serialization

_original_load = torch.serialization.load


def _patched_load(*args, **kwargs):
    kwargs["weights_only"] = False
    return _original_load(*args, **kwargs)


torch.load = _patched_load
torch.serialization.load = _patched_load
