import type { IPeopleRepository } from "@/lib/data/contracts";
import * as students from "@/lib/data/stubs/people/students-mock";
import * as teachers from "@/lib/data/stubs/people/teachers-mock";
import * as parents from "@/lib/data/stubs/people/parents-mock";
import * as classes from "@/lib/data/stubs/people/classes-mock";

export class MockPeopleRepository implements IPeopleRepository {
  readonly stubs = students;
  readonly students = students;
  readonly teachers = teachers;
  readonly parents = parents;
  readonly classes = classes;
}
