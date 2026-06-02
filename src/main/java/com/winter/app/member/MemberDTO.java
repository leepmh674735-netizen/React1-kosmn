package com.winter.app.member;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@ToString
@Table(name = "tb_users")
public class MemberDTO implements UserDetails {
    @Id
    @NotBlank(message = "아이디는 필수 입력 항목입니다.")
    @Column(name = "username")
    private String username;

    @Column(nullable = false)
    private String password;

    @Transient
    private  String passwordCheck;

    @Column
    private String name;

    @Column
    private String email;
}
