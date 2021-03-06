#!/bin/bash
# License
##########
# Copyright (c) 2014 Jameson Aranda Permission is hereby granted, free of charge, to any person obtaining a copy 
# of this software and associated documentation files (the "Software"), to deal in the Software without restriction,
# including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following 
# conditions: The above copyright notice and this permission notice shall be included in all copies or substantial 
# portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, 
# INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
# IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN 
# AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR 
# OTHER DEALINGS IN THE SOFTWARE. 

# Info
#######
# This script requires a compiled binary "pageranksum" to be added to your executable path, 
# or included in the directory that this script is executed from. The original source document
# for the binary is not available from the source site, but has been included in this repository. 
# To compile, run the following from the download directory: 
# gcc -o pageranksum pagerank.c 


# Initiate loop over input args
###############################
for dom; do

  # Parse domain
  ##############
  dom=$(sed 's/^\(https\|http\):\?\/\?\/\?//' <<< $dom | sed 's/\/.*$//' | rev | cut -d"." -f1-2 | rev)

  # Get domain registration date
  ##############################
  created=$(date '+%B %d, %Y' -d `whois $dom | egrep -o 'Creation Date: [0-9\-]{10}'|sed 's/Creation Date: //'`)

  # Get indexed links (parsed from google search result page)
  ###########################################################
  linkindex=$(curl -A Mozilla -s --get --data-urlencode "q=site:$dom" http://www.google.ca/search)
  linkindex=$(egrep -o '<div class="sd" id="resultStats">[^<]+</div>' <<< $linkindex)
  linkindex=$( sed 's/<\/\?[^>]\+>//g' <<< $linkindex | sed 's/[a-zA-Z ]//g')

  # Get backlinks
  ###############
  backlinks=$(curl -s "http://en.seokicks.de/backlinks/$dom" | egrep -uo "Link pop [[:digit:]]+" | cut -d" " -f3)

  # Get PageRank
  ##############
  request="http://toolbarqueries.google.com/tbr?client=navclient-auto&ch=`pageranksum $dom`&features=Rank&q=info:$dom"
  pagerank=$(curl -A Mozilla -s --get "$request" | cut -d":" -f3)
  if [ $pagerank = '' ]; then pagerank="N/A"; else pagerank="$pagerank/10"; fi

  # Echo out result
  #################
  echo
  echo -e "===\t$dom\t==="
  echo -e "Created:\t$created"
  echo -e "Indexed Links:\t$linkindex"
  echo -e "Backlinks:\t$backlinks"
  echo -e "PageRank:\t$pagerank"
  echo

done
