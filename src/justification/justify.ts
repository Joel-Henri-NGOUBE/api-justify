/**
 * Gets any text justified
 * @param text The text to justify
 * @param wordsPerLine The limit of words per line wanted for the justification
 * @returns The justification of the text
 */
export function justify(text: string, wordsPerLine: number = 80): string{
    // Setting each word apart in an array
    try{
        const words: Array<string> = text.split(" ")
        const wordsNumber: number = words.length
        let firstSameLineWordIndex: number = 0
        let lastSameLineWordIndex: number = 0
        let currentCharCount: number = 0
        let lines = []
        for(let i = 0; i <= wordsNumber; i++){
            if(currentCharCount + words[i].length <= wordsPerLine){
                // The current count of characters on the line is incremented with the following word number of chars and with 1 for the space that will follow the char
                currentCharCount += words[i].length + 1
                lastSameLineWordIndex = i
            }else{
                // To remove the additional space
                currentCharCount -= 1
                // Getting all the words of the current line
                const subWordsOfCurrentLine: Array<string> = words.filter((_, index) => index <= lastSameLineWordIndex && index >= firstSameLineWordIndex)
                let spacesToInsert: number = wordsPerLine - currentCharCount
                let subWordsOfCurrentLineLength: number = subWordsOfCurrentLine.length
                while(spacesToInsert > 0){
                    const areSpacesMoreNumerousThanWordsInCurrentLine: boolean = spacesToInsert > subWordsOfCurrentLineLength
                    const wordsWithSpaces: Array<string> = subWordsOfCurrentLine.map((word, index) => 
                        (areSpacesMoreNumerousThanWordsInCurrentLine && (index !== subWordsOfCurrentLineLength - 1)) 
                        ? word + " " 
                        : (index <= spacesToInsert - 1 
                            ? word + " " 
                            : word))
                    lines.push(wordsWithSpaces.join(""))
                    spacesToInsert -= subWordsOfCurrentLineLength
                    // console.log(i)
                }
                console.log(lines)
                firstSameLineWordIndex = i + 1
                currentCharCount = 0
            }     
        }
        const justifiedText: string = lines.join("\n")
        console.log(justifiedText)
        return justifiedText
    } catch(error){
        throw new Error((error as Error).message)
    }
}