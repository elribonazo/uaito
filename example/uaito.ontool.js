/** 
 * @type {import('@uaito/sdk').OnTool} 
*/
async function onTool(
    message,
) {
    try {
        const agent = this;
        const toolUse = message.content.find(m => m.type === 'tool_use');
        if (toolUse) {
            await this.runSafeCommand(
                message,
                async () => {
                    agent.inputs.push({
                        role:'user',
                        content:[{
                            type: 'tool_result',
                            name: toolUse.name,
                            tool_use_id: toolUse.id,
                            content: [
                                {
                                    "type": "text",
                                    "text": new Date().toISOString()
                                }
                            ],
                        }]
                    })
                })
            
        }
    } catch (error) {
        console.error(error)
       
    }
}

module.exports = onTool;