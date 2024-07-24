import React, {
  useState, useEffect, useCallback, useRef
} from 'react';
import { useLocation } from 'react-router-dom';
import {
  Layout, Input, Button, List, Avatar
} from 'antd';
import { SendOutlined } from '@ant-design/icons';

import { useDispatch, useSelector } from 'react-redux';
import { addMessage, setMessages } from '../../redux/messagesSlice';

import 'antd/dist/reset.css';
import style from './style.css';
import botConfig from '../../bots.json';

const { Header, Content } = Layout;

const ChatPage = () => {
  const [message, setMessage] = useState('');

  const location = useLocation();
  const { subkey } = location.state || { subkey: 'general' };

  const bot = botConfig.bots.find((b) => b.key === subkey);

  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages);

  const messagesEndRef = useRef(null);

  // Enregistrer les message dans le local storage
  const saveMessagesToLocalStorage = useCallback((msgs) => {
    localStorage.setItem(`chat[${subkey}]`, JSON.stringify(msgs));
  }, [subkey]);

  // Charger l'historique depuis le local storage
  const loadMessagesFromLocalStorage = useCallback(() => {
    const storedMessages = localStorage.getItem(`chat[${subkey}]`);
    if (storedMessages) {
      return JSON.parse(storedMessages);
    }
    return [];
  }, [subkey]);

  useEffect(() => {
    const storedMessages = loadMessagesFromLocalStorage();
    dispatch(setMessages(storedMessages));
  }, [dispatch, loadMessagesFromLocalStorage, subkey]);

  // Retourne un message si la command est reconnue
  const getCommandResponse = async (command, instanceBot = bot) => {
    let reponseCommand = 'Commande non reconnue.';
    const commandDetails = instanceBot.commands[command];

    if (commandDetails) {
      if (typeof commandDetails === 'object') {
        if (commandDetails.type === 'string') {
          reponseCommand = commandDetails.responseField.toString();
        }
        if (commandDetails.type === 'api') {
          try {
            const response = await fetch(commandDetails.url);
            const data = await response.json();
            let responseData = data[commandDetails.responseField];
            let responseData2 = '';
            if (commandDetails.responseField2) {
              responseData2 = data[commandDetails.responseField2];
              responseData = `${responseData}\n${responseData2}`.trim();
            }
            reponseCommand = responseData || 'Données non disponibles.';
          } catch (error) {
            reponseCommand = 'Erreur lors de la récupération des données.';
          }
        }
      }
    }
    return reponseCommand;
  };

  // Date et heure du message
  const getCurrentDateTime = () => {
    const now = new Date();
    return now.toLocaleString();
  };

  // Actions pour envoyer le message
  const handleEnvoyerMSG = async () => {
    if (message.trim()) {
      const command = message.trim().toLowerCase();
      const currentDateTime = getCurrentDateTime();

      const newMessage = {
        content: message,
        sender: 'Emilien',
        type: 'me',
        time: currentDateTime
      };

      if (subkey !== 'general') {
        // discussion avec un bot
        const commandResponse = await getCommandResponse(command, bot);
        const botMessage = commandResponse ? {
          content: commandResponse,
          sender: subkey,
          type: 'bot',
          time: currentDateTime
        } : null;

        dispatch(addMessage(newMessage));
        if (botMessage) {
          dispatch(addMessage(botMessage));
        }

        saveMessagesToLocalStorage([...messages, newMessage, botMessage].filter(Boolean));
      } else {
        // discussion sur le canal #general
        dispatch(addMessage(newMessage));
        botConfig.bots.forEach(async (botSolo) => {
          const commandResponse = await getCommandResponse(command, botSolo);
          const botMessage = commandResponse ? {
            content: commandResponse,
            sender: botSolo.name,
            type: 'bot',
            time: currentDateTime
          } : null;

          if (botMessage) {
            dispatch(addMessage(botMessage));
          }

          saveMessagesToLocalStorage([...messages, newMessage, botMessage].filter(Boolean));
        });
      }
      setMessage('');
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // useEffect(() => {
  //   if (messages.length && messages[messages.length - 1].type === 'me') {
  //     setTimeout(() => {
  //       const currentDateTime = getCurrentDateTime();
  //       const botMessage = {
  //         content: 'Réponse automatique',
  //         sender: subkey,
  //         type: 'bot',
  //         time: currentDateTime
  //       };
  //       dispatch(addMessage(botMessage));
  //       saveMessagesToLocalStorage([...messages, botMessage]);
  //     }, 1000);
  //   }
  // }, [messages, dispatch, saveMessagesToLocalStorage, subkey]);

  return (
    <Layout style={{ height: '100%' }}>
      <Header className="chat-header" style={{ background: '#fff', padding: 0 }}>
        <div style={{ textAlign: 'center', fontSize: '24px' }}>Chat avec {subkey}</div>
      </Header>
      <Content style={{
        padding: '0 16px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)'
      }}>
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px' }}>
          <List
            dataSource={messages}
            renderItem={(item) => (
              <List.Item className={item.type === 'me' ? style.textleft : style.textright}>
                <List.Item.Meta
                  avatar={<Avatar className={item.type === 'me' ? style.textleftmetavater : null}>
                    {item.sender.charAt(0).toUpperCase()}</Avatar>}
                  title={`${item.sender} ${item.time}`}
                  description={item.content}
                  className={item.type === 'me' ? style.textleftmeta : null}
                />
              </List.Item>
            )}
          />
          <div ref={messagesEndRef} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onPressEnter={handleEnvoyerMSG}
            style={{ marginRight: '8px', flex: 1 }} />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleEnvoyerMSG}
          >
            Envoyer
          </Button>
        </div>
      </Content>
    </Layout>
  );
};

export default ChatPage;
