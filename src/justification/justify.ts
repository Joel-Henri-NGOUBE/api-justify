/**
 * Gets any text justified
 * @param text The text to justify
 * @param wordsPerLine The limit of words per line wanted for the justification
 * @returns The justification of the text
 */
export function justify(text: string, wordsPerLine: number = 80): [string, number]{
    // Setting each word apart in an array
    try{
        const words: Array<string> = text.split(" ")
        const wordsNumber: number = words.length
        let firstSameLineWordIndex: number = 0
        let lastSameLineWordIndex: number = 0
        let currentCharCount: number = 0
        let lines: Array<string> = []
        const lastWordIndex = wordsNumber - 1
        let hasLastIndexReachedElseBlock: boolean = false
        for(let i = 0; i < wordsNumber; i++){
            if(currentCharCount + words[i].length + 1 <= wordsPerLine && i !== lastWordIndex){
                // The current count of characters on the line is incremented with the following word number of chars and with 1 for the space that will follow the char
                currentCharCount += words[i].length + 1
                lastSameLineWordIndex = i
            }else{
                if(i === lastWordIndex && currentCharCount + words[i].length + 1 <= wordsPerLine){
                    currentCharCount += words[i].length + 1
                    lastSameLineWordIndex = lastWordIndex
                }
                // To remove the additional space
                currentCharCount -= 1
                // Getting all the words of the current line
                const subWordsOfCurrentLine: Array<string> = words.filter((_, index) => index <= lastSameLineWordIndex && index >= firstSameLineWordIndex)
                let spacesToInsert: number = wordsPerLine - currentCharCount
                let subWordsOfCurrentLineLength: number = subWordsOfCurrentLine.length
                const subWordsOfCurrentLineLastIndex: number = subWordsOfCurrentLineLength - 1
                // Adding the spaces after each word different of the last line word
                const wordsWithMandatorySpaces: Array<string> = subWordsOfCurrentLine.map((word, index) => 
                    (index !== subWordsOfCurrentLineLastIndex)
                    ? word + " " 
                    : word)
                // As those variables have the same value but not the same purpose
                const currentNumberOfSpacesAdded: number = subWordsOfCurrentLineLastIndex
                let wordsWithAdditionnalSpaces: Array<string> = wordsWithMandatorySpaces
                while(spacesToInsert > 0){
                    // To know if we must add space after each non-last word or just some (They are added from the left to the right)
                    const areSpacesMoreNumerousThanWordsInCurrentLine: boolean = spacesToInsert > currentNumberOfSpacesAdded
                    wordsWithAdditionnalSpaces = wordsWithAdditionnalSpaces.map((word, index) => 
                        (areSpacesMoreNumerousThanWordsInCurrentLine && (index !== subWordsOfCurrentLineLastIndex)) 
                        ? word + " " 
                        : (index < spacesToInsert 
                            ? word + " " 
                            : word))
                    // To avoid the addition of the line when the all the spaces to add on the line are not fully added
                    // Adds the joined line with spaces to an array
                    !areSpacesMoreNumerousThanWordsInCurrentLine && lines.push(wordsWithAdditionnalSpaces.join(""))
                    // As I've added some spaces in the current iteration
                    spacesToInsert -= currentNumberOfSpacesAdded
                }
                // To permit the next iteration to start the line with the word that follows the last one on the previous iteration (which is actually this iteration)
                firstSameLineWordIndex = i + 1
                // As we must count the characters in the next line (in the next iteration)
                currentCharCount = 0       
            }     
        }
        // To trigger a line break after each line and get all the justified text
        const justifiedText: string = lines.join("\n")
        return [justifiedText, wordsNumber]
    } catch(error){
        throw new Error((error as Error).message)
    }
}