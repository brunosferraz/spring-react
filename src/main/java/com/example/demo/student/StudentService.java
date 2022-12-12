package com.example.demo.student;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public void addStudent(Student student) {
        if (studentRepository.existsStudentByEmail(student.getEmail())) {
            System.out.printf("Student" + student.getEmail());
            throw new BadRequestException(
                    "Email " + student.getEmail() + " taken."
            );
        }

        studentRepository.save(student);
    }

    public void deleteStudent(Long studentId) {
        if (!studentRepository.existsById(studentId))
            throw new StudentNotFound(
                    "Student with id " + studentId + " does not exists."
            );
        studentRepository.deleteById(studentId);
    }
}
