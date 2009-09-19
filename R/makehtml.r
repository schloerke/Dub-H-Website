options(stringsAsFactors = FALSE)


roster <- read.csv("Dub H Roster.txt", header = FALSE)
names(roster) <- c("LastName", "FirstName", "Email")

cast <- read.csv("casting.csv")
cast$X <- NULL

roster$Email <- gsub("@iastate.edu", "", roster$Email)
roster$fullname <- paste(roster$FirstName, roster$LastName, sep = " ")

for(i in 1:nrow(cast))
  for(j in 1:ncol(cast))
    cast[i,j] <- tolower(cast[i,j])
    
for(i in 1:nrow(roster))
  roster[i,"Email"] <- tolower(roster[i,"Email"])


castName <- cast
head(castName)



for(i in 1:nrow(roster))
{
  cat("\n",i/nrow(roster),"%");
  castName[castName == roster[i,"Email"] ] <- roster[i,"fullname"]
}

emails_who_are_entered_wrong <- unique(cast[castName == cast])
print(emails_who_are_entered_wrong)

people_who_are_not_casted <- unique(roster[! roster$fullname %in% as.matrix(castName), "fullname"])
print(people_who_are_not_casted)



casting <- as.list(castName)
for(i in 1:length(casting))
{
  casting[[i]] <- casting[[i]][casting[[i]] != ""]
  casting[[i]] <- casting[[i]][order(casting[[i]])]
}

choreoInfo <- read.csv("nameAndLocation.txt")


cat("<div id=\"casting\">", "\n", sep = "", file = "htmloutput.html", append = FALSE)
				
for(i in 1:nrow(choreoInfo))
{
  
  choreoInfo$tag[i] <- tolower(paste(strsplit(choreoInfo[i,"Name"]," ")[[1]], sep="", collapse=""))
  
cat("<p><b>",choreoInfo[i,"Name"],"</b>", "\n", sep = "", file = "htmloutput.html", append = TRUE)
cat("  <ul>", "\n", sep = "", file = "htmloutput.html", append = TRUE)
cat("    <li><a href=\"#", choreoInfo[i, "tag"], "\">", choreoInfo[i, "Time"], " <em>", choreoInfo[i,"Location"], "</em></a></li>", "\n", sep = "", file = "htmloutput.html", append = TRUE)
cat("  </ul>", "\n", sep = "", file = "htmloutput.html", append = TRUE)
cat("</p>", "\n", sep = "", file = "htmloutput.html", append = TRUE)
			
  
}

cat("</div>", "\n", sep = "", file = "htmloutput.html", append = TRUE)
cat("<div id=\"castinglist\">", "\n", sep = "", file = "htmloutput.html", append = TRUE)



for(i in 1:nrow(choreoInfo))
{
  
  cat("  <hr />", "\n", sep = "", file = "htmloutput.html", append = TRUE)
  cat("  <p><a name=\"",choreoInfo[i,"tag"],"\"></a><b>",choreoInfo[i,"Name"],"</b> ",choreoInfo[i,"Time"]," <em>", choreoInfo[i,"Location"], "</em><br /><a href=\"mailto:",choreoInfo[i,"Email"],"?subject= Dub H - \">",choreoInfo[i,"Email"],"</a></p>", "\n", sep = "", file = "htmloutput.html", append = TRUE)
  
  
  dancers <- casting[[choreoInfo[i,"RName"] ]]
  cat("  <ul id=\"fancy-text\">", "\n", sep = "", file = "htmloutput.html", append = TRUE)  
  for(j in 1:length(dancers))
  {
    cat("    <li>", dancers[j],"</li>", "\n", sep = "", file = "htmloutput.html", append = TRUE)
  }
  cat("  </ul>", "\n", sep = "", file = "htmloutput.html", append = TRUE)  

}
cat("</div>", "\n", sep = "", file = "htmloutput.html", append = TRUE)  








		