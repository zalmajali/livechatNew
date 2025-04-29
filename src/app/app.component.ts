import { Component } from '@angular/core';
import { AlertController, Platform, NavController, MenuController, ToastController } from '@ionic/angular';
import { Globalization } from '@awesome-cordova-plugins/globalization/ngx';
import { Storage } from '@ionic/storage-angular';
import { TranslateService } from '@ngx-translate/core';
import { DatabaseService } from "./service/database.service";
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';
import { BackgroundMode } from '@awesome-cordova-plugins/background-mode/ngx';
import { HttpClient } from '@angular/common/http';
import { ChatService } from "./service/chat.service";
import * as CryptoJS from 'crypto-js';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  public menuDirection: any;
  public checkLanguage: any = 0;
  public language: any;
  public mainUserName: any;
  public userName: any;
  public password: any;
  public apiKey: any;
  public apiKeyNew: any;
  public sessionLogin: any;
  public dir: any;
  public genaratedFullDate: any;
  public genaratedDate: any;
  public year: any;
  public month: any;
  public day: any;
  public hour: any;
  public minutes: any;
  public seconds: any;
  public returnResultData: any;
  public returnChatArray: any = [];
  public returnArrayChatFromServer: any = [];
  public pushMessage: any;
  public newPushMessage: any;
  public returnResultDataBySession: any;
  public returnArrayChatSessionFromServer: any;

  constructor(
    private chatService: ChatService,
    private http: HttpClient,
    private localNotifications: LocalNotifications,
    private backgroundMode: BackgroundMode,
    private statusBar: StatusBar,
    private databaseService: DatabaseService,
    private globalization: Globalization,
    private translate: TranslateService,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private menu: MenuController,
    private alertController: AlertController,
    private platform: Platform,
    private storage: Storage,
    private androidPermissions: AndroidPermissions
  ) {
    this.goPageValue();
    this.platform.ready().then(async () => {
      //this.requestNotificationPermission();
      //this.initStorage();
      setTimeout(async () => {
        try {
          await this.statusBar.overlaysWebView(false);
          await this.statusBar.backgroundColorByHexString('#FF7901');
          await this.statusBar.styleLightContent();
        } catch (error) { }
      }, 2500);
    });
  }
  requestNotificationPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.POST_NOTIFICATIONS).then(
      result => {
        if (!result.hasPermission) {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.POST_NOTIFICATIONS);
        }
      },
      err => {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.POST_NOTIFICATIONS);
      }
    );
  }
  async initialiseTranslation() {
    await this.translate.get('menuDirection').subscribe((res: string) => {
      this.menuDirection = res;
    });
    await this.translate.get('dir').subscribe((res: string) => {
      this.dir = res;
    });
    await this.translate.get('pushMessage').subscribe((res: string) => {
      this.pushMessage = res;
    });
    await this.translate.get('newPushMessage').subscribe((res: string) => {
      this.newPushMessage = res;
    });
  }
  async initStorage() {
    await this.storage.create();
    this.initBackgroundCheck();
  }
  initBackgroundCheck() {
    this.backgroundMode.enable();
    setInterval(() => {
      this.checkForNewMessages();
    }, 3000);
  }

  checkForNewMessages() {
    this.genaratedDate = this.year + "" + this.month + "" + this.day;
    let key = this.mainUserName + this.userName + this.password + "(OLH)" + this.genaratedDate;
    const md5Hash = CryptoJS.algo.MD5.create();
    md5Hash.update(key);
    this.apiKeyNew = md5Hash.finalize().toString();

    let currentDate = new Date();
    this.year = currentDate.getFullYear();
    this.month = currentDate.getMonth() + 1;
    this.day = currentDate.getDate();
    this.hour = currentDate.getHours();
    this.minutes = currentDate.getMinutes();
    this.seconds = currentDate.getSeconds();

    if (this.month < 10) this.month = '0' + this.month;
    if (this.day < 10) this.day = '0' + this.day;
    if (this.hour < 10) this.hour = '0' + this.hour;
    if (this.minutes < 10) this.minutes = '0' + this.minutes;
    if (this.seconds < 10) this.seconds = '0' + this.seconds;

    this.genaratedFullDate = this.year + "" + this.month + "" + this.day + this.hour + this.minutes + this.seconds;
    let sendValues = {
      'mainUserName': this.mainUserName,
      'userName': this.userName,
      'password': this.password,
      'apiKey': this.apiKeyNew,
      'onliceData': 2,
      'dateSelect': this.genaratedFullDate,
      'sessionLogin': this.sessionLogin
    };

    this.chatService.chatGetData(sendValues).then(async data => {
      this.returnResultData = data;
      if (this.returnResultData.messageId == 1 && this.returnResultData.data.process) {
        this.returnArrayChatFromServer = this.returnResultData.data.process;
        for (const key of Object.keys(this.returnArrayChatFromServer)) {
          const item = this.returnArrayChatFromServer[key];
          if (item.userName == this.userName && item.badge != 0) {
            const storedArray: string[] = await this.storage.get('lastMessageId') || [];
            let sendValues = {
              'mainUserName': this.mainUserName,
              'userName': this.userName,
              'password': this.password,
              'apiKey': this.apiKeyNew,
              'mobile': item.mobile,
              'sessionLogin': this.sessionLogin,
              'chatSessionId': item.chatSessionId
            };
            await this.chatService.chatGetDataByNumber(sendValues).then(async dataHist => {
              this.returnResultDataBySession = dataHist;
              if (this.returnResultDataBySession.messageId == 1) {
                const session = this.returnResultDataBySession.data.process[0];
                if (session.chatBot) {
                  for (const msg of session.chatBot) {
                    if (!storedArray.includes(msg.id)) {
                      storedArray.push(msg.id);
                      await this.storage.set('lastMessageId', storedArray);
                      this.sendNotification(item.mobile);
                    }
                  }
                }
                if (session.chat) {
                  for (const msg of session.chat) {
                    if (!storedArray.includes(msg.id)) {
                      storedArray.push(msg.id);
                      await this.storage.set('lastMessageId', storedArray);
                      this.sendNotification(item.mobile);
                    }
                  }
                }
              }
            });
          }
        }
      }
    }).catch(error => { });
  }
  sendNotification(sender: string) {
    try {
      this.localNotifications.schedule({
        id: 1,
        title: "فثسف فثسف",
        text: "لسرلاب رسالة",
      });
    } catch (error) {
      alert(JSON.stringify(error));
    }
  }

  async goPageValue() {
    await this.statusBar.overlaysWebView(false);
    await this.statusBar.backgroundColorByHexString('#FF7901');
    await this.statusBar.styleLightContent();
    await this.storage.create();
    await this.getDeviceLanguage();
    this.mainUserName = await this.storage.get('mainUserName');
    this.userName = await this.storage.get('userName');
    this.password = await this.storage.get('password');
    this.apiKey = await this.storage.get('apiKey');
    this.sessionLogin = await this.storage.get('sessionLogin');
    if (this.mainUserName == null || this.userName == null || this.password == null || this.apiKey == null || this.sessionLogin == null)
      this.navCtrl.navigateRoot('login');
    else
      this.navCtrl.navigateRoot('home');
  }

  async getDeviceLanguage() {
    await this.storage.get('checkLanguage').then(async (checkLanguage: any) => {
      this.checkLanguage = checkLanguage
    });
    if (this.checkLanguage) {
      this.translate.setDefaultLang(this.checkLanguage);
      this.language = this.checkLanguage;
      this.translate.use(this.language);
      await this.initialiseTranslation();
    } else {
      if (window.Intl && typeof window.Intl === 'object') {
        let Val = navigator.language.split("-");
        this.translate.setDefaultLang(Val[0]);
        this.language = (Val[0] == "ar" || Val[0] == "en") ? Val[0] : 'en';
        this.translate.use(this.language);
        await this.initialiseTranslation();
      } else {
        this.globalization.getPreferredLanguage().then(async res => {
          let Val = res.value.split("-");
          this.translate.setDefaultLang(Val[0]);
          this.language = (Val[0] == "ar" || Val[0] == "en") ? Val[0] : 'en';
          this.translate.use(this.language);
          await this.initialiseTranslation();
        }).catch(e => { console.log(e); });
      }
    }
  }
}
