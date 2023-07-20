import { ApplicationRef, Component, OnInit } from '@angular/core';
import { SwPush, SwUpdate } from '@angular/service-worker';
import { ToastrService } from 'ngx-toastr';
import { interval } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ecommerce';

  public isOnline!: boolean;
  private readonly publicKey = 'BCgI1AqTrms6cmzsNyMoUU6w-XoPoEfcxtyHGdOjHU7UJcXdoY8O7yAdFYkzTLzaWkMGhzPAM180o6kwLhmR_OY'

  constructor(
    private swUpdate: SwUpdate,
    private applicationRef: ApplicationRef,
    private swPush: SwPush,
    private toastrService: ToastrService
  ) {
    this.checkUpdate();
    this.updateClient();
  }

  ngOnInit(): void {
    this.pushSubscription();
    this.swPush.messages.subscribe();
    this.swPush.notificationClicks.subscribe(({ action, notification }) => {
      window.open(notification.data.url);
    });

    // addEventListener('offline', (e: any) => {
    //   this.toastrService.error("You are offline", '', { positionClass: 'toast-top-center' })
    // })

    // addEventListener('online', (e: any) => {
    //   this.toastrService.success("You are online", '', { positionClass: 'toast-top-center' })
    // })
  }

  updateClient() {
    this.swUpdate.available.subscribe((event: any) => {
      if (confirm("Update avilable in this application please confirm!!")) {
        this.swUpdate.activateUpdate().then(() => location.reload());
      }
    })
  }

  checkUpdate() {
    this.applicationRef.isStable.subscribe((isStable: any) => {
      if (isStable) {
        const timeInterval = interval(8 * 60 * 60 * 1000);
        timeInterval.subscribe(() => {
          this.swUpdate.checkForUpdate().then(() => { });
        })
      }
    })
  }

  pushSubscription() {
    if (!this.swPush.isEnabled) {
      this.toastrService.error("No notification send", 'Error');
      return
    }
    this.swPush.requestSubscription({
      serverPublicKey: this.publicKey,
    })
  }
}
