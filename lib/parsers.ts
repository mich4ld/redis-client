const TYPE_CHARS = ['$', '-', '+', ':'];
const delimiter = '\r\n';

export function parseCommand(...args: string[]) {
    const len = args.length;
    let parsedCommand = `*${len}${delimiter}`;

    for (const arg of args) {
        parsedCommand += `$${arg.length}${delimiter}${arg}${delimiter}`;
    }
    
    return parsedCommand;
}

function parseArray(respArray: string) {
    if (respArray === "*0\r\n") return [];
    const elements = respArray.split(delimiter);
        
    return parseReply(elements.slice(1, elements.length).join(delimiter));
}

function parseInteger(respInt: string) {
    const int = respInt.substring(1, respInt.length);
    return parseInt(int);
}

function parseString(respString: string) {
    const pureString = respString.substring(1, respString.length);
    
    if (respString.startsWith('-')) {
        return new Error(pureString);
    }
    else if (respString.startsWith('$')) {
        if (respString.startsWith('$-1')) {
            return null;
        }

        return pureString.split(delimiter)[1];
    } else {
        return pureString
    }
}

export function parseReply(rawReply: string) {
    const replies: any[] = []
    const replyQueue = rawReply
        .split(delimiter);

    while (replyQueue.length) {
        const reply = replyQueue.shift();
        const typeChar = reply!.charAt(0);

        switch (typeChar) {
            case '':
                break;
            case '$':
                const string = reply + delimiter + replyQueue.shift()!;
                replies.push(parseString(string));
                break;
            case '+':
                const simpleString = reply!;
                replies.push(parseString(simpleString));
                break;
            case ':':
                const int = reply!;
                replies.push(parseInteger(int));
                break;
            case '*':
                let array = reply + delimiter;
                let length = parseInt(reply!.substring(1, reply!.length));

                while (length) {
                    const element = replyQueue.shift();
                    array += element + delimiter;
                    const elementType = element ? element.charAt(0) : '';

                    if  (TYPE_CHARS.includes(elementType)) {
                        if (length === 1) {
                            array += replyQueue.shift() + delimiter;
                        }
                        length--;
                    }
                }

                replies.push(parseArray(array));
                break;
            default:
                const maybeError = reply!;
                replies.push(parseString(maybeError));
                break;
        }
    }

    return replies;
}