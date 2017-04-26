import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerEditDialog } from './server-edit-dialog.component';

describe('ServerListComponent', () => {
  let component: ServerEditDialog;
  let fixture: ComponentFixture<ServerEditDialog>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerEditDialog ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerEditDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
