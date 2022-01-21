import hashlib
from django.core.validators import validate_email
from django.db import models
from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager

# Custom manager


class MyUserManager(BaseUserManager):
    use_in_migrations = True
    hash_salt = '$asdi12**019'

    def create_user(self, email, password, ssn, google_id):
        """
            Add a new user
        """
        # try:
        validate_email(email)
        email = self.normalize_email(email)
        if google_id is not None:
            google_id = hashlib.sha256((google_id + self.hash_salt).encode()).hexdigest()
        ssn = hashlib.sha256((ssn + self.hash_salt).encode()).hexdigest()
        user = self.model(email=email, ssn=ssn, google_id=google_id)
        user.set_password(password)
        user.save(using=self._db)
        return user
        # except:
        #     raise ValueError("Invalid email!")

    def create_superuser(self, email, password):
        user = self.create_user(
            email,
            password,
            ssn='000000000',
            google_id=None
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    """
        User class with fields:
            1. Email ID
            2. SSN Number
            3. Password
    """
    email = models.CharField(max_length=255, unique=True)
    ssn = models.CharField(max_length=255, unique=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    google_id = models.CharField(max_length=255, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    objects = MyUserManager()

    def __str__(self):
        return self.email

    @property
    def is_staff(self):
        return self.is_admin

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin


class Card(models.Model):
    """
    Card model for the manually generated cards
    """
    card_no = models.CharField(max_length=255, unique=True)
    card_type = models.CharField(max_length=255)
    valid_through = models.CharField(max_length=255)
    bank_name = models.CharField(max_length=255)
    min_amt_due = models.DecimalField(max_digits=10, decimal_places=2)
    total_amt_due = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.bank_name


class UserCard(models.Model):
    """
    User linked to his cards
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    card = models.ManyToManyField(Card, related_name='user_cards')

    def __str__(self):
        return self.user.email


class Transaction(models.Model):
    """
    Record for each transaction
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    card = models.ForeignKey(Card, on_delete=models.CASCADE)
    amt = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(auto_now_add=True)
    points = models.IntegerField()

    def __str__(self):
        return '%s - %s' % (self.user.email, self.card.bank_name)


class RewardPoints(models.Model):
    """
    Log of the rward points
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    points_earned = models.IntegerField()

    def __str__(self):
        return self.user.email

