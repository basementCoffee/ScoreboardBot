let listOfWords = ["Wow", "Superb job", "Awesome job", "Good job", "Great job", "Well done"];

/**
 * Send a message regarding their high score.
 * @param message The message.
 * @param name The name of the commander.
 * @param value The margin of the new high score.
 */
async function sendHighScoreMessage(message, name, value) {
    let r = Math.floor(Math.random() * (listOfWords.length + 1));
    if (r >= listOfWords.length) r = listOfWords.length - 1;
    return await message.channel.send(listOfWords[r] + ' ' + name + '! You beat the high score by **' + Math.abs(value) + '**!\nForwarded to a commander for verification.');
}


/**
 * Send a reject message regarding their high score.
 * @param message The message.
 * @param commanderName The commander's name.
 * @param value The value of the difference.
 */
async function sendNotHighScoreMessage(message, commanderName, value) {
    return await message.channel.send('Sorry ' + commanderName + ', you are ' + Math.abs(value) + ' from the current high score!');
}

module.exports = {sendHighScoreMessage, sendNotHighScoreMessage}