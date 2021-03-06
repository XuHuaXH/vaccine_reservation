from django.core.management.base import BaseCommand, CommandError
from reservation.models import *
from reservation.generate_data import *


class Command(BaseCommand):
    help = 'Generate some test data to test the matching algorithm!'

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        generate_patients(300)
        generate_providers(20)
        self.stdout.write(self.style.SUCCESS('Successfully generated some test data!'))
