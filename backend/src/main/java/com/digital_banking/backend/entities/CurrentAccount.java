package com.digital_banking.backend.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

@Entity
@DiscriminatorValue("CA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CurrentAccount extends BankAccount {
    private double overDraft;
}