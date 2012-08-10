#!/bin/bash

mkdir -p ../ebook/

#original .epub
pandoc -R -S --toc -s -f html -t epub -o ../ebook/erb_thesis_original.epub ../original/0_preface.html ../original/[0-9][0-9][0-9]_*.html ../original/0_bibliography.html ../original/0_license.html

#community .epub
pandoc -R -S --toc -s -f html -t epub -o ../ebook/erb_thesis_community.epub ../community/0_preface.html ../community/[0-9][0-9][0-9]_*.html ../community/0_bibliography.html ../community/0_contributors.html ../community/0_license.html
