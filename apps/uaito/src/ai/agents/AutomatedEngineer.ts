
import fs from 'fs-extra';
import  { Agent, LLMProvider, AgentTypeToOptions, MessageInput, OnTool, MessageArray } from "@uaito/sdk";
import { ANSI_BLUE, type Tool } from "@uaito/sdk";
import { chromium, type Browser } from "playwright";
import { runTavilySearch } from '../tools/tavily';
import { extractAllText } from '../tools/extractWebContent';
import {  safeCommands } from '../../config';
import { createSystemPrompt } from '../prompts/AutomatedEngineer';


export class AutomatedEngineer<T extends LLMProvider> extends Agent<T> {
    protected color = ANSI_BLUE;
    protected name = "Engineer"
    
    get tools() {
        return this.options.tools ?? [];
    }

    override get systemPrompt() {
      return createSystemPrompt(this.options.tools);
    }

    override get chainOfThought() {
      return `Answer the user's request using relevant tools only if the tool exists. 
  Before calling a tool, do some analysis within <thinking></thinking> tags. 
  1. First, determine if you have access to the requested tool.
  2. Second, think about which of the provided tools is the relevant tool to answer the user's request. 
  3. Third, go through each of the required parameters of the relevant tool and determine if the user has directly provided or given enough information to infer a value. 
  When deciding if the parameter can be inferred, carefully consider all the context to see if it supports a specific value.
  If all of the required parawmeters are present or can be reasonably inferred, close the thinking tag and proceed with the tool call. 
  BUT, if one of the values for a required parameter is missing, 
  DO NOT invoke the function (not even with fillers for the missing params) and instead, ask the user to provide the missing parameters. 
  DO NOT ask for more information on optional parameters if it is not provided.
  DO NOT reflect on the quality of the returned search results in your response.`
    }
  
    private constructor(
      public type: T,
      protected llmOptions:AgentTypeToOptions[typeof type],
      protected onTool: OnTool,
      protected directory: string
    ) {
      super(type, llmOptions, onTool);
    }

    static async create<T extends LLMProvider>(
       type: T,
       llmOptions:AgentTypeToOptions[typeof type],
       directory: string,
       inputs: MessageArray<MessageInput>,
       onTool: OnTool,
    ) {
      const instance = new AutomatedEngineer(type, llmOptions, onTool, directory);
      await instance.addInputs(inputs);
      return instance;
    }

  
    safeCommand(command: string) {
      const commands = command.split("&&");
      commands.forEach((splitCommand) => {
        const shellCommand = splitCommand.trim().split(" ")[0]
        if (!safeCommands.includes(shellCommand)) {
          throw new Error("Unsupported command " + shellCommand)
        }
      })
      return command
    }
  
    get cwd() {
      const directory = this.directory
      if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory)
      }
      return directory;
    }
  
    async tavilySearch(query: string): Promise<{ type: string, text: string | undefined}[] | { type: string, text: string }[]> {
      const result = await runTavilySearch(query);
      const content = [
        {
          type:'text',
          text: result.answer
        }
      ]
      result.images.forEach((img: string) => {
        content.push({type:'text', text:`Image ${img}\r\n`})
      });
      return content
    }
  
    async browseWebPage(url: string, extractText: boolean): Promise<string> {
      let browser:Browser;
        browser =  await chromium.launch( {
      headless: true
      });
      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      });
  
      const page = await context.newPage();
      
      await page.goto(url, { timeout: 30000, waitUntil: 'domcontentloaded' });
      
      if (extractText) {
        const response = await extractAllText(page);
        await browser.close()
        return response
      } else {
        return page.content()
      }
    }
  
  }