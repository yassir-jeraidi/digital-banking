package com.digital_banking.backend.entities;


import com.digital_banking.backend.enums.AccountStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Entity
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "TYPE", discriminatorType = DiscriminatorType.STRING, length = 4)
@Getter @Setter
public class BankAccount {
    @Id
    private String id;
    private Date createdAt;
    private double balance;
    @Enumerated(EnumType.STRING)
    private AccountStatus status;
    private String currency;

    @ManyToOne
    private Customer customer;

    @OneToMany(mappedBy = "bankAccount", fetch = FetchType.LAZY)
    private List<AccountOperation> accountOperation;

}
