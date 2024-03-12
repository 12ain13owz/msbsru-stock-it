import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroupDirective, Validators } from '@angular/forms';
import { CategoryApiService } from '../../../services/category/category-api.service';
import {
  Category,
  CategoryForm,
  CategoryResponse,
} from '../../../models/category.model';
import { Observable, finalize } from 'rxjs';
import { Message } from '../../../../shared/models/response.model';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrl: './category-edit.component.scss',
})
export class CategoryEditComponent implements OnInit {
  @ViewChild('formDirec') formdirec: FormGroupDirective;
  @ViewChild('name') name: ElementRef<HTMLInputElement>;

  private formBuilder = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<CategoryEditComponent>);
  private data: Category = inject(MAT_DIALOG_DATA);
  private categoryApiService = inject(CategoryApiService);
  private operation$: Observable<Message | CategoryResponse>;

  title: string = 'เพิ่มประเภทอุปกรณ์';
  isEdit: boolean = false;
  isLoading: boolean = false;
  form: CategoryForm;

  ngOnInit(): void {
    this.initForm();

    if (this.data) {
      this.title = 'แก้ไขประเภทอุปกรณ์';
      this.isEdit = true;
      this.form.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    if (JSON.stringify(this.data) === JSON.stringify(this.form.value)) return;

    const payload: Category = { ...this.form.getRawValue() };
    this.isLoading = true;
    this.operation$ = this.isEdit
      ? this.categoryApiService.updateCategory(this.data.id, payload)
      : this.categoryApiService.createCategory(payload);

    this.operation$
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        if (this.isEdit) this.dialogRef.close();
        else this.onReset();
      });
  }

  onReset(): void {
    if (this.isEdit) this.form.patchValue(this.data);
    else this.formdirec.resetForm();

    this.name.nativeElement.focus();
  }

  private initForm(): void {
    this.form = this.formBuilder.nonNullable.group({
      name: ['', Validators.required],
      active: [true, Validators.required],
      remark: [''],
    });
  }
}
