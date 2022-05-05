#!/bin/sh

files=$(ls ../cleaned_data/*.csv)
for file in $files
do
    # echo $file
    newlink=$(echo $file | sed 's/_[0-9][0-9]*//g')
    ln -s $file $newlink
done