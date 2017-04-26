import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerAddDialog } from './server-add-dialog.component';

describe('ServerListComponent', () => {
  let component: ServerAddDialog;
  let fixture: ComponentFixture<ServerAddDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerAddDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerAddDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
