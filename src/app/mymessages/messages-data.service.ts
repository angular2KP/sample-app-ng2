import { Injectable } from '@angular/core';
import { SessionStorage } from '../util/sessionStorage';
import { AppConfigService, SortOrder } from '../global/app-config.service';
import { Folder } from './folders-data.service';

export interface Message {
  read: boolean;
  folder: string;
  body: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  senderName: {
    last: string;
    first: string
  };
  corpus: string;
  _id: string;
}

/** A fake REST client API for Messages resources */
@Injectable()
export class MessagesDataService extends SessionStorage<Message> {
  static sortedMessages(messages: Message[], sortOrder: SortOrder): Message[] {
    const getField = (message: Message) =>
      message[sortOrder.sortBy].toString();

    return messages.slice().sort((a, b) =>
      getField(a).localeCompare(getField(b)) * sortOrder.order
    );
  }

  constructor(appConfig: AppConfigService) {
    // http://beta.json-generator.com/api/json/get/VJl5GbIze
    super('messages', 'assets/messages.json', appConfig);
  }

  byFolder(folder: Folder) {
    const searchObject = { folder: folder._id };
    const toFromAttr = ['drafts', 'sent'].indexOf(folder._id) !== -1 ? 'from' : 'to';
    searchObject[toFromAttr] = this.appConfig.emailAddress;
    return this.search(searchObject);
  }
}
