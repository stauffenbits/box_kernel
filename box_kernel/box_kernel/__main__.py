from ipykernel.kernelapp import IPKernelApp
from .kernel import BoxKernel
IPKernelApp.launch_instance(kernel_class=BoxKernel)
