import setuptools

with open("README.md", "r") as fh:
    long_description = fh.read()

setuptools.setup(
    name="box_kernel-stauffenbits", # Replace with your own username
    version="0.0.1",
    author="Joshua M. Moore",
    author_email="moore.joshua@pm.me",
    description="A Box Kernel for Jupyter",
    long_description=long_description,
    description_content_type='text/markdown',
    url="https://github.com/stauffenbits/box_kernel",
    packages=setuptools.find_packages(),
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
)
