package com.springboot.Test.Model;

import java.util.List;
import com.springboot.Test.Model.ChatItem;
public class Request {
    private List<ChatItem> chats;

    public List<ChatItem> getChats() {
        return chats;
    }

    public void setChats(List<ChatItem> chats) {
        this.chats = chats;
    }
}
