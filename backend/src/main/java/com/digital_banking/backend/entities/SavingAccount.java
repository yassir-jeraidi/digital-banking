package com.digital_banking.backend.entities;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;

@Entity
@DiscriminatorValue("SA")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SavingAccount extends BankAccount {
    private double interestRate;
}