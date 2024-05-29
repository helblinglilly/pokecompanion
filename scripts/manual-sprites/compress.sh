#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <directory>"
    exit 1
fi

# Assign the first argument to the DIR variable
DIR=$1

# Check if the provided argument is a valid directory
if [ ! -d "$DIR" ]; then
    echo "Error: $DIR is not a directory"
    exit 1
fi

# Check if there are no GIF files in the directory
shopt -s nullglob
gif_files=("$DIR"/*.gif)
shopt -u nullglob

if [ ${#gif_files[@]} -eq 0 ]; then
    echo "No GIF files found in the directory"
    exit 0
fi

# Loop through all GIF files in the specified directory
for gif in "${gif_files[@]}"; do
    # Compress the GIF file using gifsicle
    gifsicle --batch --optimize=5 --colors 256 "$gif"

    # Output the name of the compressed GIF file
    echo "Compressed: $gif"
done

echo "All GIF files in $DIR have been compressed."
